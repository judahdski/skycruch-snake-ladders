import { gameStates, positionDisplay } from './rules'
import './RulesList.css'

const rules = [
  <>Mulai di kotak <strong>{gameStates.initialPosition}</strong>. Masukkan angka bulat <strong>1–6</strong>, lalu klik <strong>Move!</strong>.</>,
  <>Mendarat di <strong>tangga</strong> membawa player naik ke destination.</>,
  <>Mendarat di <strong>ular</strong> membawa player turun ke destination.</>,
  <>Capai kotak <strong>{gameStates.finalPosition}</strong> untuk menang. Langkah berlebih tetap berhenti di <strong>{gameStates.finalPosition}</strong>.</>,
  <>Klik <strong>Reset Game</strong> untuk mulai kembali dari awal.</>,
  <>
    <strong>Teks posisi</strong> mengikuti kelipatan:{' '}
    {positionDisplay.map(([divisor, output], index) => (
      <span key={divisor}>
        {index > 0 ? ', ' : ''}<strong>{divisor} → {output}</strong>
      </span>
    ))}.
    {' '}Hasil yang cocok digabung. Contoh: <strong>15 → foobar</strong>.
  </>,
]

export default function RulesList() {
  return (
    <section className="rules-list" aria-labelledby="rules-list-title">
      <h2 id="rules-list-title" className="rules-list__title">
        <span className="rules-list__info" aria-hidden="true" />
        Rules List
      </h2>
      <ol className="rules-list__items" role="list">
        {rules.map((rule, index) => (
          <li key={index} className="rules-list__item">
            <span className="rules-list__number" aria-hidden="true">{index + 1}</span>
            <p className="rules-list__copy">{rule}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
