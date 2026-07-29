import React from 'react';
import { FileText, Image as ImageIcon, Video, Paperclip, Download } from 'lucide-react';

export interface Evidence {
  id: string;
  filename: string;
  fileUrl: string;
  fileType: 'image' | 'document' | 'video' | 'other';
  uploadDate: string;
  uploadedBy: string;
}

interface EvidenceViewerProps {
  evidenceList: Evidence[];
}

const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ evidenceList }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-6 w-6 text-blue-500" />;
      case 'document':
        return <FileText className="h-6 w-6 text-gray-500" />;
      case 'video':
        return <Video className="h-6 w-6 text-red-500" />;
      default:
        return <Paperclip className="h-6 w-6 text-gray-500" />;
    }
  };

  if (!evidenceList || evidenceList.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
        <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No evidence attached</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Upload documents, images, or videos to support this case.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {evidenceList.map((item) => (
        <li
          key={item.id}
          className="col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="w-full flex items-center justify-between p-4 space-x-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                {getIcon(item.fileType)}
                <h3 className="text-gray-900 dark:text-white text-sm font-medium truncate">
                  {item.filename}
                </h3>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                Uploaded {new Date(item.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200 dark:divide-gray-700">
              <div className="w-0 flex-1 flex">
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-3 text-sm text-gray-700 dark:text-gray-300 font-medium border border-transparent rounded-bl-lg hover:text-gray-500 dark:hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EvidenceViewer;
