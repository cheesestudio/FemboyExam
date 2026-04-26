function calculateScore(answers) {
  const scores = { soft: 0, shy: 0, feminine: 0, voice: 0, identity: 0, action: 0 };
  const maxScores = { soft: 0, shy: 0, feminine: 0, voice: 0, identity: 0, action: 0 };

  QUESTIONS.forEach((q, i) => {
    Object.entries(q.weights).forEach(([dim, weight]) => {
      maxScores[dim] += weight;
      if (answers[i]) scores[dim] += weight;
    });
  });

  const normalized = {};
  let total = 0;
  DIMENSIONS.forEach(d => {
    normalized[d] = Math.round((scores[d] / maxScores[d]) * 100);
    total += normalized[d];
  });

  const average = Math.round(total / 6);

  let rank;
  if (average >= 90) rank = 'Saob';
  else if (average >= 75) rank = 'A';
  else if (average >= 60) rank = 'B';
  else if (average >= 40) rank = 'C';
  else rank = 'D';

  return { scores: normalized, total: average, rank };
}
