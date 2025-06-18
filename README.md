Sistema de Estoque, PDV e Gestão Financeira

>Meu objetivo com o AUTOPROD é oferecer uma solução enxuta e acessível para quem precisa integrar controle de estoque, ponto‑de‑venda e finanças em uma única aplicação web.** A stack escolhida – **Django** no back‑end e **React** no front‑end – garante velocidade de desenvolvimento, segurança e facilidade de manutenção.

---

## 🌐 Visão geral

* **Stack:** Django + React (Vite), PostgreSQL (padrão) ‑ facilmente adaptável a outros RDBMS.
* **Módulos atuais:** estoque, produtos, precificação, PDV, relatórios financeiros.
* **Foco:** micros e PMEs que precisam sair das planilhas sem investir em ERPs complexos.



---

## ▶️ Instalação local passo a passo

Clone o repositório e prepare o ambiente Python + Node:

```bash
# 1. Obtenha o código
git clone https://github.com/LucasATS/Autoprod.git
cd Autoprod

# 2. Ambiente Python
python -m venv venv
source venv/bin/activate  # no Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# 3. Backend Django
cd BACKEND
python manage.py migrate
python manage.py runserver  # backend em http://localhost:8000

# 4. Front‑end React
cd ../FRONT-DEV
npm install
npm start               # front‑end em http://localhost:3000
# (opcional) build de produção
npm run build
```

---

## 🎯 Roadmap

* [ ] Otimização SEO
* [ ] Tela de Vendas
* [ ] Curva ABC de Produtos
* [ ] PDV

  * [ ] Caixa tradicional
  * [ ] Caixa automático
* [ ] Cadastro de Produtos
* [x] Home responsiva

Contribuições são bem‑vindas! Abra uma *issue* ou envie seu *pull request*.

---

## 🛠️ Tecnologias & Badges

![DJANGO](https://img.shields.io/badge/Django-092E20?style=for-the-badge\&logo=django\&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge\&logo=javascript\&logoColor=F7DF1E)



## 📫 Contato *(atualize apenas os hrefs)*

<p align="left">
  <a href="https://github.com/felipersd8"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="Github"></a>
  <a href="https://www.instagram.com/felipe.rodriguesrsd/"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="instagram"></a>
  <a href="https://www.linkedin.com/in/feliperodriguesagile/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="linkedin"></a>
  <a href="mailto:inovartesistemaseti@gmail.com"><img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="gmail"></a>
  

---

> *Este README é mantido por Felipe Rodrigues da Silva. Sinta‑se à vontade para sugerir melhorias!*
