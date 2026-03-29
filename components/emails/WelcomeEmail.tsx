import * as React from 'react';

interface WelcomeEmailProps {
  prenom: string;
  resetLink: string;
}

export const WelcomeEmail: React.FC<Readonly<WelcomeEmailProps>> = ({
  prenom,
  resetLink,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F8F9FA', padding: '40px 20px', color: '#333' }}>
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>

      {/* HEADER : Rouge dynamique DS HY'LEC */}
      <div style={{ backgroundColor: '#E30613', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#ffffff', margin: 0, fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>
          DS HY'LEC
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', margin: '8px 0 0 0', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          L'expert de la dépollution automobile
        </p>
      </div>

      {/* CORPS DU MESSAGE */}
      <div style={{ padding: '40px 30px' }}>
        <h2 style={{ fontSize: '22px', color: '#1A1A1A', marginTop: 0, fontWeight: '900' }}>
          Bonjour {prenom} 👋,
        </h2>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
          Votre demande de rendez-vous a bien été prise en compte ! Nous sommes ravis de vous compter parmi les clients de <strong style={{ color: '#E30613' }}>DS HY'LEC</strong>.
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
          Un espace client sécurisé a été automatiquement créé pour vous. Il vous permettra de suivre vos factures, l'entretien de vos véhicules et d'accéder à votre <strong>cagnotte de parrainage</strong>.
        </p>

        {/* BOUTON D'ACTION : Nouveau vert */}
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
            Créer mon mot de passe
          </a>
        </div>

        <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#888', textAlign: 'center', backgroundColor: '#f9fafb', padding: '15px', borderRadius: '12px' }}>
          Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br/>
          <a href={resetLink} style={{ color: '#E30613', wordBreak: 'break-all', fontWeight: 'bold', textDecoration: 'none', marginTop: '5px', display: 'block' }}>
            {resetLink}
          </a>
        </p>
      </div>

      {/* FOOTER */}
      <div style={{ backgroundColor: '#1A1A1A', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
          © {new Date().getFullYear()} DS HY'LEC. Tous droits réservés.<br/>
          Intervention à domicile pour particuliers et professionnels.
        </p>
      </div>

    </div>
  </div>
);