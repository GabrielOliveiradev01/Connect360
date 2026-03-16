/**
 * Netlify Function - Proxy para envio de leads à API Zimba CVM
 * Evita CORS chamando a API pelo servidor.
 */
const ZIMBA_URL = 'https://zimba.cvcrm.com.br/api/v1/cvbot/lead';
const ZIMBA_EMAIL = 'theo@cia360.com.br';
const ZIMBA_TOKEN = '8a6651c923da453ed3c97b9ddef8a39823db1cac';
const EMPREENDIMENTO_ID = '2';

const headers = {
  'accept': 'application/json',
  'content-type': 'application/json',
  'email': ZIMBA_EMAIL,
  'token': ZIMBA_TOKEN
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { nome, email, telefone } = JSON.parse(event.body || '{}');
    if (!nome || !email || !telefone) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'nome, email e telefone obrigatórios' })
      };
    }

    // 1. Criar lead
    const createRes = await fetch(ZIMBA_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        nome: String(nome).toUpperCase(),
        telefone: String(telefone).replace(/\D/g, ''),
        email,
        idempreendimento: EMPREENDIMENTO_ID
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      return {
        statusCode: createRes.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: errText || `Erro ${createRes.status}` })
      };
    }

    const createData = await createRes.json();
    const idlead = createData.idlead ?? createData.id_lead ?? createData.id ?? createData.data?.idlead ?? createData.data?.id;

    // 2. Atualizar empreendimento do lead
    if (idlead) {
      const updateUrl = `https://zimba.cvcrm.com.br/api/v1/cvbot/lead/${idlead}/alterar_empreendimento`;
      const updateRes = await fetch(updateUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ idempreendimento: EMPREENDIMENTO_ID })
      });
      if (!updateRes.ok) {
        console.warn('Lead criado, falha ao atualizar empreendimento:', await updateRes.text());
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('Erro submit-lead:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message || 'Erro ao processar' })
    };
  }
};
