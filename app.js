// ===== Diccionario inglés (el español vive en el HTML) =====
const en={
  navServices:'Services',navPhilosophy:'Philosophy',navCalc:'Estimator',navContact:'Contact',
  eyebrow:'FREELANCE DEVELOPER · GUATEMALA',
  headline:'Software built for you, <em>and 100% yours.</em>',
  intro:'I’m a freelance developer based in Guatemala. I build websites, software and automations tailored to you and hand them over complete: the code is yours, with no monthly fees and no lock-in.',
  cta:'Request my quote ↗',
  estimate:'Estimate your project ↓',
  servicesTitle:'From an idea to a <em>real product.</em>',
  servicesIntro:'Solutions built around your goals, with attention to every detail and ready to grow with you.',
  s1:'Websites that connect',
  s1p:'Fast, mobile-friendly and search-ready websites that present your business clearly.',
  s2:'Custom software',
  s2p:'Applications and systems designed around your real processes, not the other way around.',
  s3:'Smart automation',
  s3p:'I connect your tools and remove repetitive tasks so you can focus on what matters.',
  philTitle:'I don’t sell you a subscription. <em>I hand you something that’s yours.</em>',
  philIntro:'I’m a Guatemalan developer, and my goal is to raise the level of software development in the country: serious, close and accessible work. That’s why I don’t work with subscriptions that tie you down. I build your project to measure and hand it over complete, so you can use it and change it however you like.',
  p1:'You own everything',
  p1p:'I hand you 100% of the source code and every access. I keep nothing: you keep it all.',
  p2:'No monthly fees',
  p2p:'I don’t sell subscriptions. You pay for your project once and it’s yours. No mandatory monthly fees.',
  p3:'Customizable your way',
  p3p:'Everything is built so you or your team can change it whenever you want, without depending on me forever.',
  p4:'Only the cloud, if you want it',
  p4p:'The only thing that can be monthly, and it’s optional, is the cloud or hosting. And you can put it under your own name.',
  calcTitle:'Let’s shape an <em>investment estimate.</em>',
  calcDesc:'Choose what you need for an indicative range in quetzales and dollars. Every project is unique and gets a formal quote after we talk.',
  disclaimer:'Illustrative estimate; not a final quote. Reference approx. Q8 = US$1.',
  type:'Project type',
  option1:'Informational website / landing',
  option2:'Website with catalog, bookings or store',
  option3:'Custom application or system',
  extras:'What would you like to include?',
  extra1:'Integrations and automation',
  extra2:'Administration dashboard',
  extra3:'Content in two languages',
  range:'ESTIMATED RANGE',
  discuss:'Discuss my project ↗',
  faqTitle:'What people <em>always ask.</em>',
  q1:'Do you charge a monthly fee?',
  a1:'No. You pay for the development once. The only recurring thing —and it’s optional— is the cloud or hosting if you want me to manage it; you can also put it under your own name.',
  q2:'Who owns the code in the end?',
  a2:'You do, 100%. I hand you the source code and every access. I keep nothing.',
  q3:'Can I modify the site later?',
  a3:'Yes. Everything is delivered so you or your team can modify it however you like, whenever you want.',
  q4:'Do you work across Guatemala?',
  a4:'Yes. I’m based in Guatemala City and work remotely with clients across the whole country.',
  q5:'How do I request a quote?',
  a5:'Use the estimator for a rough range and fill in the form with your project. I reply personally to talk it through and prepare a tailored quote.',
  contactTitle:'Your next project <em>starts here.</em>',
  contactDesc:'Tell me what you have in mind. I review the details and reply personally to give you an answer and a tailored quote.',
  privacy:'Your information will be used only to respond to this request.',
  name:'Name',project:'Project type',message:'Tell me about your idea',send:'Send request ↗',
  footer:'Freelance software development in Guatemala.'
};

// ===== Idioma: guarda el español original y permite alternar (con ?lang) =====
const originals={};
document.querySelectorAll('[data-i]').forEach(e=>originals[e.dataset.i]=e.innerHTML);
const params=new URLSearchParams(location.search);
let language=(params.get('lang')||'').toLowerCase();
if(language!=='es'&&language!=='en') language=navigator.language.toLowerCase().startsWith('es')?'es':'en';

function translate(){
  document.documentElement.lang=language;
  document.querySelectorAll('[data-i]').forEach(e=>{
    const v=language==='en'?en[e.dataset.i]:originals[e.dataset.i];
    if(v!==undefined) e.innerHTML=v;
  });
  document.title=language==='en'
    ?'Freelance Developer in Guatemala | Custom Websites & Software · SG Labs'
    :'Desarrollador Freelance en Guatemala | Webs y Software a Medida · SG Labs';
  try{
    const u=new URL(location);
    u.searchParams.set('lang',language);
    history.replaceState(null,'',u);
  }catch(_){}
}
document.querySelector('#lang').onclick=()=>{language=language==='es'?'en':'es';translate();};
translate();

// ===== Calculadora de presupuesto (USD + GTQ) =====
const GTQ=8; // referencia aprox. Q8 = US$1
let cleanEstimate='';
function calculate(){
  let amount=Number(document.querySelector('#type').value);
  document.querySelectorAll('[data-extra]:checked').forEach(e=>amount+=Number(e.value));
  const high=Math.round(amount*1.6);
  const usd=`$${amount.toLocaleString('en-US')} – $${high.toLocaleString('en-US')} USD`;
  const gtq=`Q${(amount*GTQ).toLocaleString('en-US')} – Q${(high*GTQ).toLocaleString('en-US')}`;
  cleanEstimate=`${usd} / ${gtq}`;
  document.querySelector('#price').innerHTML=`${usd}<br><small>${gtq}</small>`;
}
document.querySelector('#type').onchange=calculate;
document.querySelectorAll('[data-extra]').forEach(e=>e.onchange=calculate);
calculate();

// ===== Formulario -> n8n (vía /api/v1/public/leads) =====
document.querySelector('#form').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget, status=document.querySelector('#status'), button=form.querySelector('button');
  button.disabled=true;
  status.textContent=language==='es'?'Enviando…':'Sending…';
  try{
    const response=await fetch('/api/v1/public/leads',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        name:document.querySelector('#name').value,
        email:document.querySelector('#email').value,
        project:document.querySelector('#project').value,
        message:document.querySelector('#message').value,
        estimate:cleanEstimate,
        language
      })
    });
    if(!response.ok)throw Error();
    status.textContent=language==='es'?'Solicitud enviada. Gracias por contactarme, te respondo pronto.':'Request sent. Thanks for reaching out, I’ll reply soon.';
    form.reset();
  }catch{
    status.textContent=language==='es'?'No se pudo enviar. Inténtalo de nuevo más tarde.':'Unable to send. Please try again later.';
  }finally{
    button.disabled=false;
  }
});
