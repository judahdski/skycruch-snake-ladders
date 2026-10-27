const gameStates = {
    widthBoard: 10,
    heightBoard: 10,
    initialPosition: 1,
    finalPosition: 10 * 10,
};

const sourceDestPairs = [
    [2, 38],
    [7, 14],
    [8, 31],
    [15, 26],
    [28, 84],
    [16, 6],
    [40, 11],
    [62, 19],
    [64, 60],
    [99, 80],
];

const positionDisplay = [
    [3, "foo"],
    [4, "baz"],
    [5, "bar"],
    [7, "jazz"],
    [9, "huzz"],
];

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

export { gameStates, sourceDestPairs, positionDisplay, rules };
