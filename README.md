# Smart City – Projeto Integrador

### 📌 Descrição

Este projeto integra o conceito de **Cidade Inteligente**, sendo uma aplicação voltada para o monitoramento de dados urbanos simulados via sensores, que coletam:

- 🌡️ Temperatura (°C)  
- 💧 Umidade (%)  
- 💡 Luminosidade (lux)  
- 🔢 Contador de pessoas (unidades)  

A solução foi construída em duas camadas:

- **Back-End** com Django Rest Framework 
- **Front-End** com React 

Os dados dos sensores são armazenados no banco SQLite e disponibilizados por meio de uma API segura com autenticação via JWT.

---

## ⚙️ Funcionalidades

✅ CRUD completo para:
- Ambientes  
- Sensores  
- Histórico de dados  

✅ Filtros por:
- Tipo de sensor (temperatura, umidade, etc.)  
- ID  
- Data (timestamp)  
- Código do ambiente (SIG)

✅ Importação e exportação de dados via arquivos **Excel (.xlsx)**  
✅ Resumo com contagem de sensores ativos e inativos  
✅ Autenticação protegida com **JWT**  
