import React, { useState } from 'react'

const TERMS = [
  {
    term: 'EPIC Card',
    short: 'Elector Photo Identity Card',
    detail: 'Your official Voter ID issued by the Election Commission of India. Contains your photo, name, date of birth, and a unique 10-character EPIC number. Required for voter identification at polling booths.',
    category: 'identity',
  },
  {
    term: 'EVM',
    short: 'Electronic Voting Machine',
    detail: 'The machine you use to cast your vote. It has buttons for each candidate with their party symbol. Once you press a button, a beep confirms your vote. EVMs are standalone machines with no internet or bluetooth connection — they cannot be hacked remotely.',
    category: 'voting',
  },
  {
    term: 'VVPAT',
    short: 'Voter Verifiable Paper Audit Trail',
    detail: 'A machine next to the EVM that prints a paper slip for 7 seconds after your vote. The slip shows the candidate symbol and name you voted for. This is your proof that the EVM recorded your vote correctly.',
    category: 'voting',
  },
  {
    term: 'NOTA',
    short: 'None of the Above',
    detail: 'The last option on every EVM ballot. If you are dissatisfied with all candidates, press NOTA. Your vote is counted but goes to no candidate. Under current Indian law, even if NOTA gets the most votes, the candidate with the next highest votes still wins.',
    category: 'voting',
  },
  {
    term: 'Tender Vote',
    short: 'Challenged Vote / Form 49A',
    detail: 'If someone has already voted using your name before you arrived at the booth, you have the legal right to cast a Tender Vote. The Presiding Officer cannot refuse this request. Your tender vote is kept separately and counted only if the margin of victory is less than the number of tender votes.',
    category: 'rights',
  },
  {
    term: 'ERO',
    short: 'Electoral Registration Officer',
    detail: 'The government official responsible for maintaining the voter rolls for an assembly constituency. If your name is wrongly deleted, you appeal to the ERO. You can also file Form 6, 7, 8 applications at the ERO office.',
    category: 'officials',
  },
  {
    term: 'BLO',
    short: 'Booth Level Officer',
    detail: 'A government official assigned to a specific polling booth. The BLO visits homes in the area to verify voter registrations, correct errors, and help with applications. Call 1950 to get your BLO\'s contact number.',
    category: 'officials',
  },
  {
    term: 'Form 6',
    short: 'Application for New Registration',
    detail: 'Filed by first-time voters or voters who have moved to a new constituency. Submit at voters.eci.gov.in or your nearest ERO office. Requires proof of age (18+) and address proof.',
    category: 'forms',
  },
  {
    term: 'Form 7',
    short: 'Application for Deletion / Objection',
    detail: 'Used to report a duplicate entry, object to a wrongful registration, or request deletion of a deceased voter\'s name from the roll. Also used when you suspect your own name was wrongfully deleted.',
    category: 'forms',
  },
  {
    term: 'Form 8',
    short: 'Application for Correction',
    detail: 'Used to correct errors in your voter registration — name spelling, address, photo, date of birth, or gender. You can also use Form 8 to change the booth or constituency when you move within the same state.',
    category: 'forms',
  },
  {
    term: 'Mock Poll',
    short: 'Mandatory EVM Test Before Voting',
    detail: 'Every EVM runs a mandatory test vote before real polling starts. This is required by ECI rules. The mock poll results ARE visible on the EVM — this is completely normal. All mock data is cleared and the EVM is reset before actual voting begins. This is NOT a sign of rigging.',
    category: 'voting',
  },
  {
    term: 'Exit Poll',
    short: 'Post-Voting Survey (Not a Result)',
    detail: 'A survey conducted by media agencies asking voters who they voted for, AFTER they have exited the polling booth. Exit polls are NOT the actual election result. They are estimates and are often inaccurate. The actual result comes from vote counting, usually 1–2 weeks after polling day. Conducting exit polls near a polling booth during voting hours is illegal.',
    category: 'results',
  },
  {
    term: 'Counting Day',
    short: 'When Votes Are Counted',
    detail: 'A separate day (usually 1–2 weeks after polling day) when all votes from all constituencies are counted simultaneously. Results are announced constituency by constituency as counting progresses. The official winner is declared after counting is 100% complete.',
    category: 'results',
  },
  {
    term: 'Postal Ballot',
    short: 'Vote Without Going to the Booth',
    detail: 'Eligible voters (senior citizens 85+, PwD voters, essential service workers, and overseas voters) can vote by post without visiting the booth. You must apply for a postal ballot before the deadline using the prescribed form. The ballot paper is mailed to you, you vote and return it by mail before counting day.',
    category: 'voting',
  },
  {
    term: 'MCC',
    short: 'Model Code of Conduct',
    detail: 'A set of guidelines issued by the ECI that applies to all political parties and candidates from the date elections are announced until results are declared. The MCC restricts government spending announcements, use of government machinery for campaigns, hate speech, and distribution of cash or gifts to voters.',
    category: 'rules',
  },
  {
    term: 'cVIGIL',
    short: 'ECI Corruption Reporting App',
    detail: 'An official app by the Election Commission for citizens to report election law violations — cash distribution, liquor distribution, vote buying, and other MCC violations. Reports are geo-tagged, anonymous, and dispatched to a flying squad within 100 minutes.',
    category: 'rules',
  },
  {
    term: 'Phase',
    short: 'Election Phase / Round',
    detail: 'General Elections in India are conducted in multiple phases (usually 5–7) spread over several weeks. Each phase covers specific states and constituencies. Your polling day depends on which phase your constituency is in. All results are announced on a single Counting Day.',
    category: 'schedule',
  },
  {
    term: 'Affidavit',
    short: 'Candidate Declaration Form',
    detail: 'Every candidate must file a sworn affidavit with the ECI before the election. The affidavit declares all criminal cases (pending and convicted), movable and immovable assets, liabilities, educational qualifications, and PAN details. Affidavits are public documents available at affidavit.eci.gov.in.',
    category: 'transparency',
  },
  {
    term: 'ADR',
    short: 'Association for Democratic Reforms',
    detail: 'An independent non-profit that analyses candidate affidavits and publishes plain-language summaries of candidate backgrounds. ADR reports are a key source for data on criminal cases and assets. Available at adrindia.org and myneta.info.',
    category: 'transparency',
  },
]

const CATEGORIES: Record<string, string> = {
  all: 'All Terms',
  voting: 'Voting',
  identity: 'Identity',
  rights: 'Rights',
  forms: 'Forms',
  officials: 'Officials',
  results: 'Results',
  rules: 'Rules',
  schedule: 'Schedule',
  transparency: 'Transparency',
}

export default function Glossary() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = TERMS.filter(t => {
    const matchSearch = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.short.toLowerCase().includes(search.toLowerCase()) || t.detail.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || t.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Election Glossary</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2, color: 'var(--text-secondary)' }}>Every election term explained in plain language</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search terms (EVM, NOTA, Form 6...)"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.9rem', marginBottom: 14, boxSizing: 'border-box' }}
      />

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <button key={key} onClick={() => setCategory(key)}
            style={{
              padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: `1px solid ${category === key ? 'var(--primary)' : 'var(--border)'}`,
              background: category === key ? 'var(--primary)' : 'var(--surface)', color: category === key ? 'white' : 'var(--text-secondary)',
              fontFamily: 'inherit', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: 600,
            }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14 }}>{filtered.length} terms</div>

      {/* Terms List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(t => (
          <div key={t.term} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <button
              onClick={() => setExpanded(expanded === t.term ? null : t.term)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--surface)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)', textAlign: 'left' }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{t.term}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>{t.short}</div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flexShrink: 0, marginLeft: 8 }}>{expanded === t.term ? '▲' : '▼'}</span>
            </button>
            {expanded === t.term && (
              <div style={{ padding: '0 16px 16px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, marginTop: 12 }}>{t.detail}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
