const Case = require("../models/Case");
const { analyzeCaseData } = require("../services/analysisService");
const { redactPII } = require("../services/redactionService");
const { classifyThreat } = require("../services/classifierService");
const { generateLegalBrief } = require("../services/briefGenerator");

const createCase = async (req, res, next) => {
  try {
    const {
      victimName,
      age,
      abuseType,
      incidentDescription,
      frequency,
      threatLevel,
      statement
    } = req.body;

    const descriptionRaw = `${incidentDescription} \n ${statement || ""}`.trim();
    const title = `${abuseType} Incident for ${victimName}`;

    // Execute AI Pipeline concurrently where possible
    const [descriptionAnonymized, threatClassification] = await Promise.all([
      redactPII(descriptionRaw).catch(() => descriptionRaw),
      classifyThreat(descriptionRaw).catch(() => ({ threatLevel: 'MEDIUM', riskScore: 50, categories: [] }))
    ]);

    const partialCaseData = {
      victimName,
      abuseType,
      descriptionRaw,
      abuseCategories: threatClassification.categories || []
    };

    const structuredBrief = await generateLegalBrief(partialCaseData).catch(() => ({}));

    // Fallback analyzeCaseData for generatedBrief text
    const legacyAnalysis = analyzeCaseData({
      abuseType,
      frequency,
      threatLevel,
      incidentDescription,
      statement,
      victimName,
      age
    });

    const createdCase = await Case.create({
      complainantId: req.user ? req.user._id : undefined,
      title,
      victimName,
      age,
      abuseType,
      incidentDescription,
      frequency,
      threatLevel,
      statement: statement || "",
      descriptionRaw,
      descriptionAnonymized,
      aiThreatLevel: threatClassification.threatLevel,
      riskScore: threatClassification.riskScore,
      abuseCategories: threatClassification.categories,
      status: threatClassification.threatLevel === 'HIGH' ? 'URGENT' : 'PENDING',
      analysis: {
        severity: legacyAnalysis.severity,
        riskScore: legacyAnalysis.riskScore,
        abusePatterns: legacyAnalysis.abusePatterns,
        generatedBrief: legacyAnalysis.generatedBrief,
        structuredBrief
      }
    });

    res.status(201).json({
      message: "Case created successfully",
      caseId: createdCase._id,
      data: createdCase
    });
  } catch (error) {
    next(error);
  }
};

const analyzeCase = async (req, res, next) => {
  try {
    const { caseId, statement } = req.body;

    if (!caseId) {
      return res.status(400).json({ message: "caseId is required" });
    }

    const caseDoc = await Case.findById(caseId);
    if (!caseDoc) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (typeof statement === "string") {
      caseDoc.statement = statement;
    }

    const result = analyzeCaseData(caseDoc);

    caseDoc.analysis = result;
    await caseDoc.save();

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getCaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ message: "Case not found" });
    }

    return res.status(200).json(caseDoc);
  } catch (error) {
    next(error);
  }
};

const getAllCases = async (req, res, next) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    return res.status(200).json(cases);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCase,
  analyzeCase,
  getCaseById,
  getAllCases
};