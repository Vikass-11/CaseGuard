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
    <div className="space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-12 w-12 bg-muted rounded-xl border border-border flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-foreground" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">Admin Panel</h1>
          <p className="text-muted-foreground text-sm tracking-wide mt-1">Manage users and view system audit logs.</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Users</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Audit Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6 space-y-8">
          
          {/* Create User Form */}
          <div className="bg-card rounded-3xl border border-border overflow-hidden p-8">
            <h2 className="text-lg font-bold tracking-tight text-foreground uppercase mb-6">Create New User</h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Name</label>
                <input required type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="block w-full bg-muted border border-border px-4 py-2 text-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all rounded-lg text-sm" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Email</label>
                <input required type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="block w-full bg-muted border border-border px-4 py-2 text-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all rounded-lg text-sm" placeholder="john@clinic.com" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Reg Number (Password)</label>
                <input required type="text" value={newUserRegNum} onChange={e => setNewUserRegNum(e.target.value)} className="block w-full bg-muted border border-border px-4 py-2 text-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all rounded-lg text-sm" placeholder="REG-12345" />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Role</label>
                <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="block w-full bg-muted border border-border px-4 py-2 text-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all rounded-lg text-sm">
                  <option value="CASE_WORKER">Case Worker</option>
                  <option value="LAWYER">Lawyer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <button disabled={creating} type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-md">
                  {creating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="border-b border-border">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Name</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Email</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Current Role</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Change Role</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id} className="border-b border-border hover:bg-muted/60 transition-colors">
                    <TableCell className="font-bold text-foreground text-sm tracking-wide py-6 px-8">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground py-6 px-8">{u.email}</TableCell>
                    <TableCell className="py-6 px-8">
                      <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full ${
                          u.role === 'admin' ? 'border-primary text-foreground' : 'border-border text-muted-foreground'
                        }`}>
                          {u.role.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <select 
                        className="block w-full bg-muted border border-border px-4 py-2 text-foreground focus:border-primary/40 focus:ring-1 focus:ring-ring/40 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-xs appearance-none rounded-lg"
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
                        className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="bg-card rounded-3xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="border-b border-border">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Timestamp</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">User</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Action</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Entity</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground py-6 px-8">Entity ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id} className="border-b border-border hover:bg-muted/60 transition-colors">
                    <TableCell className="text-muted-foreground text-xs py-6 px-8">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-foreground text-sm tracking-wide py-6 px-8">{log.userId?.name || log.userId}</TableCell>
                    <TableCell className="py-6 px-8">
                      <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-border text-muted-foreground rounded-full">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-foreground font-medium py-6 px-8">{log.entityType}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground py-6 px-8">{log.entityId}</TableCell>
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
