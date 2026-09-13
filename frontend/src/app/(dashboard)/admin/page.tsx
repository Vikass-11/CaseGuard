'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('CASE_WORKER');
  const [newUserRegNum, setNewUserRegNum] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, logsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/audit-logs')
      ]);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchData();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/users', {
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        registrationNumber: newUserRegNum
      });
      alert('User created successfully! Their initial password is ' + newUserRegNum);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRegNum('');
      setNewUserRole('CASE_WORKER');
      fetchData();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="text-foreground text-center p-12">Loading admin data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center space-x-4 mb-8 bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
        <div className="h-14 w-14 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center">
          <ShieldAlert className="h-7 w-7 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground text-sm font-medium tracking-wide mt-1">Manage users and view system audit logs.</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-transparent border-b border-border/60 w-full justify-start h-auto p-0 space-x-8 rounded-none mb-6">
          <TabsTrigger value="users" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground transition-all">Users</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-2 py-4 font-bold tracking-wide uppercase text-xs text-muted-foreground transition-all">Audit Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6 space-y-8">
          
          {/* Create User Form */}
          <div className="bg-card rounded-2xl border border-border/80 overflow-hidden p-8 shadow-sm">
            <h2 className="text-sm font-bold tracking-widest text-foreground uppercase mb-6">Create New User</h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Name</label>
                <input required type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="block w-full bg-background border border-border/80 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-medium text-sm rounded-xl shadow-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Email</label>
                <input required type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="block w-full bg-background border border-border/80 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-medium text-sm rounded-xl shadow-sm" placeholder="john@clinic.com" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Reg Number (Password)</label>
                <input required type="text" value={newUserRegNum} onChange={e => setNewUserRegNum(e.target.value)} className="block w-full bg-background border border-border/80 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-medium text-sm rounded-xl shadow-sm" placeholder="REG-12345" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">Role</label>
                <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="block w-full bg-background border border-border/80 px-4 py-3 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-medium text-sm rounded-xl shadow-sm appearance-none">
                  <option value="CASE_WORKER">Case Worker</option>
                  <option value="LAWYER">Lawyer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <button disabled={creating} type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3 px-4 rounded-xl text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-lg disabled:opacity-70">
                  {creating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 px-8">Name</TableHead>
                  <TableHead className="py-4 px-8">Email</TableHead>
                  <TableHead className="py-4 px-8">Current Role</TableHead>
                  <TableHead className="py-4 px-8">Change Role</TableHead>
                  <TableHead className="py-4 px-8 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id} className="cursor-pointer transition-colors hover:bg-muted/10 group">
                    <TableCell className="py-6 px-8">
                      <span className="text-sm font-bold text-foreground tracking-wide">{u.name}</span>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-muted-foreground font-medium">{u.email}</TableCell>
                    <TableCell className="py-6 px-8">
                      <span className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border rounded-md shadow-sm ${
                          u.role === 'admin' ? 'border-primary/20 bg-primary/5 text-primary' : 'border-border bg-muted/20 text-muted-foreground'
                        }`}>
                          {u.role.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <select 
                        className="block w-full max-w-[150px] bg-background border border-border/80 px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-300 font-semibold tracking-wide text-xs appearance-none rounded-lg shadow-sm"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u.email === 'admin@caseguard.com'}
                      >
                        <option value="case_worker">Case Worker</option>
                        <option value="lawyer">Lawyer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={u.email === 'admin@caseguard.com'}
                        className="text-[10px] font-bold uppercase tracking-widest text-destructive hover:text-destructive/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 px-8">Timestamp</TableHead>
                  <TableHead className="py-4 px-8">User</TableHead>
                  <TableHead className="py-4 px-8">Action</TableHead>
                  <TableHead className="py-4 px-8">Entity</TableHead>
                  <TableHead className="py-4 px-8">Entity ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id} className="transition-colors hover:bg-muted/10">
                    <TableCell className="py-6 px-8 text-muted-foreground text-xs font-medium">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="py-6 px-8 font-bold text-foreground text-sm tracking-wide">{log.userId?.name || log.userId}</TableCell>
                    <TableCell className="py-6 px-8">
                      <span className="inline-flex items-center px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-border/80 bg-muted/20 text-muted-foreground rounded-md shadow-sm">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-foreground font-semibold">{log.entityType}</TableCell>
                    <TableCell className="py-6 px-8 font-mono text-xs text-muted-foreground">{log.entityId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
