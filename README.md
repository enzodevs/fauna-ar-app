# Fauna AR 🐆

Aplicação web de realidade aumentada para visualização de animais da fauna brasileira usando WebXR.

## 🚀 Tecnologias

- **React** + **TypeScript** - Framework e tipagem
- **Vite** - Build tool e dev server
- **Three.js** - Renderização 3D
- **WebXR** - Realidade aumentada nativa
- **Tailwind CSS** - Estilização

## 📋 Pré-requisitos

- Node.js 18+
- NPM ou Yarn
- Navegador com suporte a WebXR (Chrome Android recomendado)
- Câmera (dispositivo móvel)
- HTTPS ou localhost (requisito WebXR)

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

1. **Acesse a aplicação** no Chrome Android (navegador recomendado)
2. **Permita o acesso à câmera** quando solicitado
3. **Selecione um animal** na tela inicial
4. **Toque em "START AR"** para iniciar a sessão WebXR
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
- ✅ Chrome Android (recomendado)
- ⚠️ Edge Mobile (limitado)
- ❌ Safari iOS (WebXR não suportado)
- ❌ Navegadores desktop (WebXR AR não disponível)

## 🎯 Funcionalidades

- [x] Landing page com cards de animais
- [x] Integração WebXR com hit-testing
- [x] Carregamento de modelos 3D GLB/GLTF
- [x] Posicionamento de modelos em superfícies reais
- [x] Informações detalhadas sobre os animais
- [x] Animações dos modelos 3D
- [x] Detecção de superfícies planas
- [ ] Múltiplos animais funcionais
- [ ] Sons dos animais
- [ ] Interações gestuais

## 🚀 Deploy

Projeto preparado para deploy na Vercel:

```bash
npm run build
# Upload da pasta dist para Vercel
```

## 📝 Licença

MIT

## 👨‍💻 Desenvolvido por

Enzo - Projeto AR educacional sobre fauna brasileira