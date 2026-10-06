import { useState } from 'react'
import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import { SITE } from '../data/site.js'
import { useStore } from '../lib/store.jsx'
import Modal from './Modal.jsx'

const LOGIN_CODE = '271828'

// Connexion des membres : compte Google ou code à usage unique reçu par email.
export default function LoginModal() {
  const { dispatch } = useStore()
  const [step, setStep] = useState('choix')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const close = () => dispatch({ type: 'login/close' })
  const login = (address) =>
    dispatch({ type: 'member/login', member: { ...SITE.membreDemo, email: address || SITE.membreDemo.email } })

  const sendCode = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Saisissez une adresse email valide.')
      return
    }
    setError('')
    setStep('code')
  }

  const verify = (event) => {
    event.preventDefault()
    if (code.replace(/\s/g, '') !== LOGIN_CODE) {
      setError('Code incorrect. Utilisez le code de démonstration ci-dessous.')
      return
    }
    login(email.trim().toLowerCase())
  }

  return (
    <Modal id="connexion-titre" eyebrow="Espace membre" title="Se connecter au 12G2" onClose={close}>
      <div className="login">
        {step === 'choix' && (
          <>
            <button type="button" className="btn login__option" onClick={() => login()}>
              <span className="login__g" aria-hidden="true">
                G
              </span>
              Continuer avec Google
            </button>
            <button type="button" className="btn login__option" onClick={() => setStep('email')}>
              <Mail aria-hidden="true" /> Recevoir un code par email
            </button>
            <p className="small muted">
              Simulation : « Continuer avec Google » connecte directement le compte de démonstration.
            </p>
            <hr className="divider" />
            <p className="small muted">
              Pas encore inscrit ? L’inscription se fait avec le lien d’invitation partagé dans le groupe WhatsApp du 12G2, puis un
              administrateur la valide. Aucun compte n’est nécessaire pour écrire dans un livre de condoléances.
            </p>
          </>
        )}

        {step === 'email' && (
          <form className="form" onSubmit={sendCode} noValidate>
            <div className="field">
              <label htmlFor="membre-email">Adresse email</label>
              <input
                id="membre-email"
                className="input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(error)}
              />
              {error && (
                <span className="field__error" role="alert">
                  {error}
                </span>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                <Mail aria-hidden="true" /> Recevoir un code
              </button>
              <button type="button" className="btn btn--quiet" onClick={() => setStep('choix')}>
                <ArrowLeft aria-hidden="true" /> Retour
              </button>
            </div>
            <p className="demo-hint">
              Compte de démonstration : <code>{SITE.membreDemo.email}</code>
              <button type="button" className="btn btn--sm" onClick={() => setEmail(SITE.membreDemo.email)}>
                Utiliser ce compte
              </button>
            </p>
          </form>
        )}

        {step === 'code' && (
          <form className="form" onSubmit={verify} noValidate>
            <p>
              Sur la vraie plateforme, le code arrive dans la boîte de <strong>{email.trim()}</strong>.
            </p>
            <div className="field">
              <label htmlFor="membre-code">Code à 6 chiffres</label>
              <input
                id="membre-code"
                className="input"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-invalid={Boolean(error)}
              />
              {error && (
                <span className="field__error" role="alert">
                  {error}
                </span>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                <KeyRound aria-hidden="true" /> Se connecter
              </button>
            </div>
            <p className="demo-hint">
              Code de démonstration : <code>{LOGIN_CODE}</code>
              <button type="button" className="btn btn--sm" onClick={() => setCode(LOGIN_CODE)}>
                Remplir
              </button>
            </p>
          </form>
        )}
      </div>
    </Modal>
  )
}
