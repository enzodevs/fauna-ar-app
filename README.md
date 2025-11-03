# Fauna AR 🐆

Aplicação web de realidade aumentada para visualização de animais da fauna brasileira.

## 📋 Pré-requisitos

- Navegador compatível com realidade aumentada (recomendado em dispositivos móveis)
- Câmera funcional
- Conexão segura (HTTPS ou localhost)

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```
## 📱 Como Usar

1. **Acesse a aplicação** em um navegador compatível (dispositivo móvel recomendado)
2. **Permita o acesso à câmera** quando solicitado
3. **Selecione um animal** na tela inicial
4. **Toque em "START AR"** para iniciar a sessão de realidade aumentada
5. **Procure por uma superfície plana** (mesa, chão, etc.)
6. **Toque na tela** quando o círculo de mira aparecer para posicionar o animal

## 🗂️ Estrutura do Projeto

```
fauna-ar/
├── public/
│   ├── models/          # Modelos 3D GLB/GLTF
│   │   └── jaguar.glb   # Adicione seu modelo aqui
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx
│   │   └── ARScene.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```
## ⚠️ Importante

### Adicionar Modelo 3D
1. Coloque o arquivo `jaguar.glb` em `/public/models/`
2. O modelo deve estar no formato GLB ou GLTF
3. Recomenda-se modelos otimizados (<5MB)

### Compatibilidade
- ✅ Navegadores modernos em Android (recomendado)
- ⚠️ Navegadores em dispositivos móveis com suporte a AR (limitado)
- ❌ Safari iOS (AR não suportada)
- ❌ Navegadores desktop (AR não disponível)

## 🎯 Funcionalidades

- [x] Landing page com cards de animais
- [x] Experiência de realidade aumentada
- [x] Visualização de modelos 3D interativos
- [x] Posicionamento de modelos em superfícies reais
- [x] Informações detalhadas sobre os animais
- [x] Animações dos modelos 3D
- [x] Detecção de superfícies planas
- [ ] Múltiplos animais funcionais
- [ ] Sons dos animais
- [ ] Interações gestuais

## 🚀 Deploy

Projeto preparado para deploy em serviços de hospedagem web:

```bash
npm run build
# Upload da pasta dist para o serviço de hospedagem
```

## 📝 Licença

MIT