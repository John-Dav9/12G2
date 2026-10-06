import { Lock, LogIn } from 'lucide-react'
import { useStore } from '../lib/store.jsx'

export default function MembersGate({ title = 'Réservé aux membres du 12G2', children }) {
  const { dispatch } = useStore()
  return (
    <div className="code-gate">
      <span className="code-gate__icon" aria-hidden="true">
        <Lock />
      </span>
      <h2>{title}</h2>
      <p className="muted">
        {children ??
          'Connectez-vous avec votre compte membre pour voir ce contenu. Les inscriptions se font sur invitation et sont validées par un administrateur.'}
      </p>
      <div className="form-actions">
        <button type="button" className="btn btn--primary" onClick={() => dispatch({ type: 'login/open' })}>
          <LogIn aria-hidden="true" /> Se connecter
        </button>
      </div>
    </div>
  )
}
