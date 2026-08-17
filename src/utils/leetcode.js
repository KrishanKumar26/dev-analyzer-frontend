// Backend /api/user/leetcode/{username} raw LeetCode GraphQL JSON deta hai.
// Ye helper usko frontend ke seedhe totalSolved/easy/medium/hard shape me convert karta hai.

export const parseLeetCode = (raw) => {
  const user = raw?.data?.matchedUser;
  if (!user) return null; // user not found ya empty response

  const counts = { All: 0, Easy: 0, Medium: 0, Hard: 0 };
  (user.submitStats?.acSubmissionNum || []).forEach((s) => {
    if (s && s.difficulty in counts) counts[s.difficulty] = s.count;
  });

  return {
    username: user.username,
    totalSolved: counts.All,
    easySolved: counts.Easy,
    mediumSolved: counts.Medium,
    hardSolved: counts.Hard,
    ranking: user.profile?.ranking || 0,
  };
};

// Backend ke apne endpoint se LeetCode stats laata hai (auth token ke saath).
// Fail / not-found pe null return karta hai.
export const fetchLeetCode = async (apiUrl, username, token) => {
  const res = await fetch(
    `${apiUrl}/api/user/leetcode/${encodeURIComponent(username)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  const raw = await res.json();
  return parseLeetCode(raw);
};
