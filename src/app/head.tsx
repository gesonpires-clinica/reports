export const metadata = {
  title: "Meu Projeto - Título da Aba",
  description: "Descrição do meu projeto.",
  icons: {
    icon: "/favicon.ico", // O arquivo deve estar em public/favicon.ico
  },
};

export default function Head() {
    return (
      <>
        <title>Meu Projeto - Título da Aba</title>
        <meta name="description" content="Descrição do meu projeto." />
        <link rel="icon" href="/favicon.ico" />
      </>
    );
  }
  