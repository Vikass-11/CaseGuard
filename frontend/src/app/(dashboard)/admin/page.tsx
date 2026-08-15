'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading admin data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <ShieldAlert className="h-8 w-8 text-slate-800" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Panel</h1>
          <p className="text-slate-500">Manage users and view system audit logs.</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <select 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u.email === 'admin@caseguard.com'} // Prevent changing main admin
                      >
                        <option value="case_worker">Case Worker</option>
                        <option value="lawyer">Lawyer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Entity ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell className="text-slate-500 text-sm">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{log.userId?.name || log.userId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs bg-slate-50">{log.action}</Badge>
                    </TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{log.entityId}</TableCell>
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
