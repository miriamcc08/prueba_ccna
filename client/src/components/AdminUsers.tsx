import React, { useEffect, useRef, useState } from 'react';
import { ManagedUser, UserRole } from '@shared/types';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../i18n/useTranslation';
import api from '../services/api';

type Listing = { users: ManagedUser[]; page: number; total: number; totalPages: number };
const empty = { email: '', username: '', language: 'es', role: 'user' as UserRole, password: '', reason: '' };
export default function AdminUsers() {
  const { user } = useAuth();
  const { language } = useTranslation();
  const l = (es: string, en: string) => language === 'es' ? es : en;
  const owner = user?.role === 'superadmin';
  const [listing, setListing] = useState<Listing>({ users: [], page: 1, total: 0, totalPages: 1 });
  const [search,setSearch] = useState(''); const [page,setPage] = useState(1); const [removed,setRemoved] = useState(false);
  const [error,setError] = useState(''); const [message,setMessage] = useState(''); const [busy,setBusy] = useState(false); const [loading,setLoading] = useState(false);
  const [target,setTarget] = useState<ManagedUser | null>(null);
  const [mode,setMode] = useState<'create' | 'edit' | 'remove' | 'restore' | null>(null);
  const [form,setForm] = useState(empty);
  const [audits,setAudits] = useState<any[] | null>(null);
  const requestId = useRef(0);
  async function load() {
    const version = ++requestId.current; setLoading(true); setError('');
    const result = await api.manageUsers<Listing>(`?page=${page}&search=${encodeURIComponent(search)}&removed=${removed}`);
    if (version !== requestId.current) return;
    setLoading(false);
    if (result.success && result.data) setListing(result.data); else { setListing({ users: [], page, total: 0, totalPages: 1 }); setError(result.message || result.error || l('No se pudo cargar.', 'Loading failed.')); }
  }
  useEffect(() => { void load(); return () => { requestId.current++; }; }, [page,search,removed]);
  const canManage = (account: ManagedUser) => owner || account.role === 'user';
  function open(next: NonNullable<typeof mode>, account: ManagedUser | null = null) {
    setTarget(account); setMode(next); setError(''); setMessage(''); setAudits(null);
    setForm(account ? { email: account.email, username: account.username, language: account.language, role: account.role, password: '', reason: '' } : { ...empty });
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); if (!mode) return; setBusy(true); setError('');
    const editing = mode === 'edit' || mode === 'create';
    const payload = editing ? { ...form, password: form.password || undefined } : { reason: form.reason };
    const result = await api.manageUsers(mode === 'create' ? '' : '/' + target!.id + (mode === 'restore' ? '/restore' : ''), mode === 'edit' ? 'PUT' : mode === 'remove' ? 'DELETE' : 'POST', payload);
    setBusy(false);
    if (!result.success) { setError(result.message || result.error || l('No se guardó.', 'Save failed.')); return; }
    setMode(null); setMessage(l('Cambio guardado. Las sesiones anteriores de la cuenta modificada dejan de ser válidas.', 'Saved. Previous sessions for the changed account are invalidated.')); void load();
  }
  return <section className="card space-y-4" aria-label={l('Gestión de usuarios', 'User management')}>
    <h2 className="text-xl font-bold">{l('Usuarios y roles', 'Users and roles')}</h2>
    <p>{owner ? l('Superadmin: puedes gestionar cuentas y otorgar roles. No puedes retirar tu propia cuenta ni cambiar tu propio rol.', 'Superadmin: manage accounts and grant roles. You cannot remove your own account or change your own role.') : l('Admin: puedes crear, editar y desactivar usuarios normales. Solo el superadmin gestiona administradores y roles.', 'Admin: create, edit and deactivate normal users. Only superadmin manages administrators and roles.')}</p>
    <button className="btn-primary" onClick={() => open('create')}>{l('Crear usuario','Create user')}</button>
    <label className="block">{l('Buscar usuarios','Search users')}<input className="input-field w-full" value={search} onChange={e => { setSearch(e.target.value);setPage(1); }} /></label>
    <label><input type="checkbox" checked={removed} onChange={e => {setRemoved(e.target.checked);setPage(1);}} /> {l('Mostrar usuarios desactivados','Show deactivated users')}</label>
    {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
    {loading && <p role="status">{l('Cargando usuarios…','Loading users…')}</p>}
    {!loading && <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr><th>{l('Usuario','User')}</th><th>{l('Correo','Email')}</th><th>{l('Rol','Role')}</th><th>{l('Acciones','Actions')}</th></tr></thead><tbody>
      {listing.users.map(account => <tr key={account.id}><td>{account.username}</td><td>{account.email}</td><td>{account.role}</td><td className="space-x-2 py-2">
        {canManage(account) && (account.deletedAt ? <button className="btn-secondary" onClick={() => open('restore',account)}>{l('Restaurar usuario','Restore user')}</button> : <>
          <button className="btn-secondary" onClick={() => open('edit',account)}>{l('Editar usuario','Edit user')}</button>
          {account.id !== user?.id && <button className="btn-secondary" onClick={() => open('remove',account)}>{l('Eliminar usuario','Delete user')}</button>}
        </>)}
        {owner && <button className="btn-secondary" onClick={async () => { const result = await api.manageUsers<any[]>('/'+account.id+'/audit'); if (result.success) setAudits(result.data || []); else setError(result.error || 'Error'); }}>{l('Ver auditoría','View audit')}</button>}
      </td></tr>)}
    </tbody></table>{listing.users.length === 0 && <p>{l('No hay usuarios con estos filtros.','No matching users.')}</p>}</div>}
    <nav aria-label={l('Paginación de usuarios','User pagination')} className="flex gap-3"><button className="btn-secondary" disabled={page <= 1 || loading} onClick={() => setPage(page-1)}>{l('Anterior','Previous')}</button><span>{page} / {listing.totalPages} ({listing.total})</span><button className="btn-secondary" disabled={page >= listing.totalPages || loading} onClick={() => setPage(page+1)}>{l('Siguiente','Next')}</button><button className="btn-secondary" onClick={() => void load()}>{l('Actualizar','Refresh')}</button></nav>
    {mode && <form onSubmit={submit} className="border rounded p-4 space-y-3" aria-label={l('Formulario de usuario','User form')}>
      <h3>{mode === 'create' ? l('Crear usuario','Create user') : mode === 'edit' ? l('Editar usuario','Edit user') : mode === 'remove' ? l('Confirmar desactivación','Confirm deactivation') : l('Confirmar restauración','Confirm restoration')}</h3>
      {target && <p>{target.email}</p>}
      {mode === 'create' || mode === 'edit' ? <>
        <label className="block">{l('Nombre de usuario','Username')}<input className="input-field w-full" required minLength={3} maxLength={254} value={form.username} onChange={e => setForm({...form,username:e.target.value})} /></label>
        <label className="block">{l('Correo electrónico','Email address')}<input className="input-field w-full" type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></label>
        <label className="block">{l('Idioma del usuario','User language')}<select className="input-field" value={form.language} onChange={e => setForm({...form,language:e.target.value})}><option value="es">Español</option><option value="en">English</option></select></label>
        <label className="block">{l('Rol del usuario','User role')}<select className="input-field" disabled={!owner || target?.id === user?.id} value={form.role} onChange={e => setForm({...form,role:e.target.value as UserRole})}><option value="user">user</option>{owner && <><option value="admin">admin</option><option value="superadmin">superadmin</option></>}</select></label>
        <label className="block">{l('Contraseña nueva','New password')}<input className="input-field w-full" type="password" autoComplete="new-password" required={mode === 'create'} minLength={12} value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></label>
        <p>{l('Mínimo 12 caracteres y máximo 72 bytes UTF-8. Al editar, deja vacío para conservar la contraseña.','At least 12 characters and at most 72 UTF-8 bytes. Leave blank when editing to keep the password.')}</p>
      </> : <p>{mode === 'remove' ? l('Se bloqueará el acceso y se conservarán exámenes y revisiones. Podrás restaurar la cuenta.','Access will be blocked; exams and reviews are preserved. You can restore the account.') : l('Volverá con rol user. La restauración no recupera privilegios administrativos.','Returns with the user role. Restoration does not recover administrative privileges.')}</p>}
      <label className="block">{l('Motivo de la gestión','Management reason')}<textarea className="input-field w-full" required minLength={20} maxLength={2000} value={form.reason} onChange={e => setForm({...form,reason:e.target.value})} /></label>
      <button className="btn-primary" disabled={busy || form.reason.trim().length < 20}>{mode === 'remove' ? l('Confirmar eliminación','Confirm deletion') : mode === 'restore' ? l('Confirmar restauración','Confirm restoration') : l('Guardar usuario','Save user')}</button>
      <button className="btn-secondary" type="button" disabled={busy} onClick={() => setMode(null)}>{l('Cancelar','Cancel')}</button>
    </form>}
    {audits && <section aria-label={l('Auditoría de usuarios','User audit')}><h3>{l('Últimos 100 cambios','Last 100 changes')}</h3>{audits.length === 0 && <p>{l('Sin cambios registrados.','No recorded changes.')}</p>}{audits.map(entry => <article key={entry.id} className="border-b py-2"><p>{new Date(entry.createdAt).toLocaleString(language)} — {entry.action}</p><p>{l('Actor','Actor')}: {entry.actorId}</p><p>{entry.reason}</p><pre className="whitespace-pre-wrap break-all">{entry.beforeJson} → {entry.afterJson}</pre></article>)}</section>}
  </section>;
}
