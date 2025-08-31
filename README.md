# Fauna AR 🐆

Aplicação web de realidade aumentada para visualização de animais da fauna brasileira usando marcadores AR.

## 🚀 Tecnologias

- **React** + **TypeScript** - Framework e tipagem
- **Vite** - Build tool e dev server
- **Three.js** - Renderização 3D
- **AR.js** - Realidade aumentada baseada em marcadores
- **Tailwind CSS** - Estilização

## 📋 Pré-requisitos

- Node.js 18+
- NPM ou Yarn
- Navegador com suporte a WebRTC (Chrome recomendado)
- Câmera (celular ou webcam)
- Marcador Hiro impresso

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

1. **Baixe o marcador Hiro**: [Download aqui](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png)
2. **Imprima o marcador** ou abra em outro dispositivo
3. **Acesse a aplicação** no navegador mobile
4. **Permita o acesso à câmera**
5. **Selecione um animal** na tela inicial
6. **Aponte a câmera** para o marcador Hiro

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
- ✅ Chrome Android
- ✅ Edge Mobile
- ⚠️ Safari iOS (limitado)
- ❌ Desktop (sem AR, apenas visualização 3D)

## 🎯 Funcionalidades

- [x] Landing page com cards de animais
- [x] Integração com câmera
- [x] Carregamento de modelos 3D
- [x] Visualização 3D básica
- [x] Informações sobre os animais
- [ ] Detecção de marcador AR (próxima versão)
- [ ] Múltiplos animais funcionais
- [ ] Animações dos modelos
- [ ] Sons dos animais

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