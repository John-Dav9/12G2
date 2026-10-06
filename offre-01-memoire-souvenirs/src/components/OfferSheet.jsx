import { CircleCheck, CircleMinus } from 'lucide-react'
import { OFFRE } from '../data/offre.js'
import { fcfa } from '../lib/format.js'
import Modal from './Modal.jsx'

const amount = (row) => {
  if (row.offert) return 'Offert'
  if (!row.montant) return '0 F CFA'
  return `${row.approx ? '≈ ' : ''}${fcfa(row.montant)}`
}

export default function OfferSheet({ onClose }) {
  return (
    <Modal
      id="offre-titre"
      eyebrow={`Proforma ${OFFRE.reference} · ${OFFRE.date}`}
      title={`Offre ${OFFRE.numero} · ${OFFRE.nom}`}
      onClose={onClose}
    >
      <div className="offer">
        <p className="lead">{OFFRE.accroche}</p>

        <section>
          <h3>Objectif</h3>
          <p>{OFFRE.objectif}</p>
        </section>

        <section>
          <h3>Ce qui est inclus</h3>
          <ul className="check-list">
            {OFFRE.inclus.map((line) => (
              <li key={line}>
                <CircleCheck aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Hors périmètre</h3>
          <ul className="check-list check-list--out">
            {OFFRE.horsPerimetre.map((line) => (
              <li key={line}>
                <CircleMinus aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Investissement de la première année</h3>
          <div className="table-wrap">
            <table className="proforma">
              <thead>
                <tr>
                  <th scope="col">Désignation</th>
                  <th scope="col" className="num">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody>
                {OFFRE.investissement.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td className="num">{amount(row)}</td>
                  </tr>
                ))}
                <tr className="is-sub">
                  <td>Sous-total réalisation</td>
                  <td className="num">{fcfa(OFFRE.sousTotal)}</td>
                </tr>
                {OFFRE.tiersAnnee1.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td className="num">{amount(row)}</td>
                  </tr>
                ))}
                <tr className="is-total">
                  <td>Total année 1</td>
                  <td className="num">≈ {fcfa(OFFRE.totalAnnee1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3>Frais annuels à partir de la deuxième année</h3>
          <div className="table-wrap">
            <table className="proforma">
              <thead>
                <tr>
                  <th scope="col">Désignation</th>
                  <th scope="col" className="num">
                    Montant annuel
                  </th>
                </tr>
              </thead>
              <tbody>
                {OFFRE.annuel.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td className="num">{amount(row)}</td>
                  </tr>
                ))}
                <tr className="is-total">
                  <td>Total annuel</td>
                  <td className="num">
                    ≈ {fcfa(OFFRE.totalAnnuel.sans)}
                    <br />
                    <span className="small muted">≈ {fcfa(OFFRE.totalAnnuel.avec)} {OFFRE.totalAnnuel.label ?? 'avec l’assistance'}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <dl className="facts">
          <div>
            <dt>Délai</dt>
            <dd>{OFFRE.delai}</dd>
          </div>
          <div>
            <dt>Paiement</dt>
            <dd>{OFFRE.paiement}</dd>
          </div>
          <div>
            <dt>Par membre</dt>
            <dd>{OFFRE.parMembre}</dd>
          </div>
          <div>
            <dt>Évolution</dt>
            <dd>{OFFRE.evolution}</dd>
          </div>
          <div>
            <dt>Validité</dt>
            <dd>{OFFRE.validite}</dd>
          </div>
        </dl>

        <p className="fine-print">{OFFRE.mentions}</p>
      </div>
    </Modal>
  )
}
