import * as React from 'react';

interface ResetPasswordEmailProps {
  prenom: string;
  resetLink: string;
}

export const ResetPasswordEmail: React.FC<Readonly<ResetPasswordEmailProps>> = ({
  prenom,
  resetLink,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8F9FA', padding: '40px 20px', color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

      <div style={{ backgroundColor: '#E30613', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>
          DS HY'LEC
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0 0 0', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Réinitialisation du mot de passe
        </p>
      </div>

      <div style={{ padding: '40px 30px' }}>
        <h2 style={{ fontSize: '22px', color: '#1A1A1A', marginTop: 0, fontWeight: '900' }}>
          Bonjour {prenom} 👋,
        </h2>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
          Vous avez demandé à réinitialiser votre mot de passe pour votre compte <strong style={{ color: '#E30613' }}>DS HY'LEC</strong>.
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
          Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien est valable <strong>1 heure</strong>.
        </p>

        <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
          <a
            href={resetLink}
            style={{
              backgroundColor: '#43A047',
              color: '#ffffff',
              padding: '16px 32px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              display: 'inline-block',
              boxShadow: '0 4px 12px rgba(67, 160, 71, 0.3)'
            }}
          >
            Réinitialiser mon mot de passe
          </a>
        </div>

        <div style={{ backgroundColor: '#fff8f0', border: '1px solid #ffe0b2', borderRadius: '12px', padding: '16px 20px', margin: '24px 0' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#e65100', fontWeight: 'bold' }}>
            ⚠️ Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe reste inchangé.
          </p>
        </div>

        <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#888', textAlign: 'center', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '12px' }}>
          Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br />
          <a href={resetLink} style={{ color: '#E30613', wordBreak: 'break-all', fontWeight: 'bold', textDecoration: 'none', marginTop: '5px', display: 'block' }}>
            {resetLink}
          </a>
        </p>
      </div>

      <div style={{ backgroundColor: '#1A1A1A', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
          © {new Date().getFullYear()} DS HY'LEC. Tous droits réservés.<br />
          Intervention à domicile pour particuliers et professionnels.
        </p>
      </div>

    </div>
  </div>
);
