'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Trash2,
  Activity,
  History,
  Lock,
  Loader2,
  CheckCircle2,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('CASE_WORKER');
  const [newUserRegNum, setNewUserRegNum] = useState('');
  const [creating, setCreating] = useState(false);

  // Search filters
  const [userSearch, setUserSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, logsRes, metricsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/audit-logs'),
        api.get('/admin/evals/metrics').catch(() => ({ data: { metrics: [] } }))
      ]);
      setUsers(usersRes.data || []);
      setLogs(logsRes.data || []);
      if (metricsRes?.data?.metrics) {
        setMetrics(metricsRes.data.metrics);
      }
    } catch (error: any) {
      console.error('Error fetching admin data:', error);
      toast.error(error?.response?.data?.message || 'Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully.');
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}? This action is logged permanently.`)) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User removed from organization.');
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setCreating(true);
    try {
      const res = await api.post('/admin/users', {
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
        registrationNumber: newUserRegNum.trim() || undefined
      });
      const initialPass = newUserRegNum.trim() || 'SecurePass123!';
      toast.success(`User created successfully. Initial temporary password is: ${initialPass}`);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRegNum('');
      setNewUserRole('CASE_WORKER');
      fetchData();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to create user account.');
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const filteredLogs = logs.filter((log) => {
    const q = logSearch.toLowerCase();
    const actorName = log.actorId?.name || log.actorId?.email || '';
    const colName = log.collectionName || '';
    const act = log.action || '';
    return (
      actorName.toLowerCase().includes(q) ||
      colName.toLowerCase().includes(q) ||
      act.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-sm font-bold text-foreground">Loading Administrative Governance Console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-8 rounded-3xl border border-border/80 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 bg-[#534145]/10 rounded-2xl border border-[#534145]/20 flex items-center justify-center text-[#534145] shrink-0">
            <ShieldAlert className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9E6752]">TENANT GOVERNANCE</span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                RBAC ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Administrative Command Center
            </h1>
            <p className="text-muted-foreground text-xs font-medium mt-1">
              Supervise advocate credentials, review immutable audit trails, and inspect human-in-the-loop AI evaluation metrics.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full space-y-6">
        <TabsList className="bg-card border border-border/80 p-1 rounded-2xl h-auto">
          <TabsTrigger
            value="users"
            className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            Advocate Users ({users.length})
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            System Audit Trail ({logs.length})
          </TabsTrigger>
          <TabsTrigger
            value="evals"
            className="rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
          >
            AI Clinical Evaluation
          </TabsTrigger>
        </TabsList>
        
        {/* TAB 1: USERS */}
        <TabsContent value="users" className="space-y-6">
          
          {/* Create User Card */}
          <Card className="rounded-3xl border-border/80 shadow-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-bold text-foreground">Provision New Legal Advocate Account</CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                New accounts require a temporary password change on their initial login.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-4">
              <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <Input 
                    required 
                    type="text" 
                    value={newUserName} 
                    onChange={e => setNewUserName(e.target.value)} 
                    placeholder="Jane Doe, Esq." 
                    className="h-10 text-xs rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <Input 
                    required 
                    type="email" 
                    value={newUserEmail} 
                    onChange={e => setNewUserEmail(e.target.value)} 
                    placeholder="jane@firm.org" 
                    className="h-10 text-xs rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bar / Reg Number</Label>
                  <Input 
                    type="text" 
                    value={newUserRegNum} 
                    onChange={e => setNewUserRegNum(e.target.value)} 
                    placeholder="Optional (Acts as temp pass)" 
                    className="h-10 text-xs rounded-xl bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Assigned Role</Label>
                  <select 
                    value={newUserRole} 
                    onChange={e => setNewUserRole(e.target.value)} 
                    className="w-full h-10 px-3 bg-background border border-border/80 rounded-xl text-xs font-semibold text-foreground focus:outline-none"
                  >
                    <option value="CASE_WORKER">Case Worker</option>
                    <option value="LAWYER">Lawyer / Litigator</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                <div>
                  <Button 
                    disabled={creating} 
                    type="submit" 
                    className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer"
                  >
                    {creating ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Provisioning...
                      </span>
                    ) : (
                      'Provision User'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Users Table */}
          <div className="bg-card rounded-3xl border border-border/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
              <h3 className="text-xs font-bold tracking-widest uppercase text-foreground">
                Registered Advocates ({filteredUsers.length})
              </h3>
              <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-xl border border-border/80 w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Advocate Name</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Email</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Role</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Change Privilege</TableHead>
                    <TableHead className="py-4 px-6 text-right text-xs font-bold uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => {
                    const isProtectedAdmin = u.email === 'admin@caseguard.com';
                    return (
                      <TableRow key={u._id} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="py-4 px-6 font-bold text-sm text-foreground">
                          {u.name || 'Unnamed Advocate'}
                        </TableCell>
                        <TableCell className="py-4 px-6 text-xs font-mono text-muted-foreground">
                          {u.email}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                            u.role === 'ADMIN'
                              ? 'bg-[#534145] text-white'
                              : u.role === 'LAWYER'
                              ? 'bg-[#2D4354] text-white'
                              : 'bg-muted text-foreground'
                          }`}>
                            {u.role?.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <select 
                            className="bg-background border border-border/80 px-3 py-1.5 text-foreground text-xs font-semibold rounded-lg shadow-sm focus:outline-none disabled:opacity-50"
                            value={u.role?.toUpperCase()}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={isProtectedAdmin}
                          >
                            <option value="CASE_WORKER">CASE WORKER</option>
                            <option value="LAWYER">LAWYER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-right">
                          <button 
                            onClick={() => handleDeleteUser(u._id, u.email)}
                            disabled={isProtectedAdmin}
                            className="text-xs font-bold text-destructive hover:text-destructive/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            Delete User
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: AUDIT LOGS */}
        <TabsContent value="logs">
          <div className="bg-card rounded-3xl border border-border/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
              <div>
                <h3 className="text-xs font-bold tracking-widest uppercase text-foreground">
                  Immutable Cryptographic Audit Trail ({filteredLogs.length})
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Permanent log of all creations, updates, deletions, and clinical overrides.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-xl border border-border/80 w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search logs by actor or entity..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Timestamp</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Actor / User</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Operation</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Collection</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-bold uppercase tracking-wider">Document Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                        No audit events recorded matching current filter.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => {
                      const actorText = log.actorId?.name || log.actorId?.email || 'System Operation';
                      const actionColor =
                        log.action === 'CREATE'
                          ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                          : log.action === 'DELETE'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-primary/10 text-primary border-primary/20';

                      return (
                        <TableRow key={log._id} className="hover:bg-muted/10 transition-colors">
                          <TableCell className="py-4 px-6 text-xs font-mono text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="py-4 px-6 text-xs font-bold text-foreground">
                            {actorText}
                          </TableCell>
                          <TableCell className="py-4 px-6">
                            <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border rounded-md ${actionColor}`}>
                              {log.action}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-xs font-semibold text-foreground">
                            {log.collectionName || 'General'}
                          </TableCell>
                          <TableCell className="py-4 px-6 font-mono text-[11px] text-muted-foreground">
                            {String(log.documentId || '').substring(0, 16)}...
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: AI EVALUATION */}
        <TabsContent value="evals">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metrics.map((metric, idx) => (
                <div key={idx} className="bg-card rounded-3xl border border-border/80 p-8 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{metric.label}</h3>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">{metric.value}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{metric.description}</p>
                  
                  {metric.value?.includes('%') && (
                    <div className="w-full bg-muted/30 h-2 mt-4 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${parseFloat(metric.value) > 20 ? 'bg-[#9E6752]' : 'bg-[#2D4354]'}`} 
                        style={{ width: metric.value }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Card className="rounded-3xl border-border/80 p-8 space-y-4">
              <h3 className="text-base font-bold text-foreground">Human-in-the-Loop Adherence Standards</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                CaseGuard actively monitors and audits the rate at which human attorneys adjust or correct machine-generated lethality predictions and recommendations. A healthy override rate demonstrates active professional discretion in accordance with ABA Model Rules.
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
