# Sistema de Relatórios de Avaliação Neuropsicopedagógica

## Sobre o Projeto
Este sistema foi desenvolvido para auxiliar profissionais da psicopedagogia e neuropsicopedagogia na elaboração de Relatórios de Avaliação Neuropsicopedagógica (RAN). O objetivo principal é permitir que o profissional foque no conteúdo do relatório, enquanto o sistema cuida da formatação e diagramação do documento.

## Funcionalidades Principais
- Criação e edição de relatórios de avaliação
- Formulário estruturado com todas as seções necessárias
- Geração automática de PDF formatado profissionalmente
- Dashboard para gerenciamento de relatórios
- Sistema de backup e versionamento

## Tecnologias Utilizadas
- Next.js 15.1.6
- TypeScript
- MongoDB
- Tailwind CSS
- PDFMake para geração de PDFs

## Estrutura do Projeto
```
src/
├── app/              # Rotas e páginas da aplicação
├── components/       # Componentes reutilizáveis
├── lib/             # Utilitários e configurações
├── styles/          # Estilos globais
└── assets/          # Recursos estáticos
```

## Seções do Relatório
1. Identificação do Paciente
2. Queixa
3. Histórico do Desenvolvimento e da Saúde
4. Vida Escolar
5. Comportamento Durante a Avaliação
6. Avaliação
   - Instrumentos Utilizados
   - Síntese dos Resultados
7. Conclusão
8. Fechamento

## Como Usar
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione as variáveis necessárias (MONGODB_URI, etc.)
4. Execute o projeto em desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse http://localhost:3000

## Próximas Implementações
- Sistema de templates de relatórios
- Editor rico de texto
- Banco de frases comuns
- Sistema de backup
- Melhorias na interface de edição
- Sistema de sugestões baseado em relatórios anteriores
- Integração com sistemas de agendamento
- Versão mobile responsiva

## Contribuição
Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contato
Para mais informações, entre em contato através do email: clinicaneuromarianebach@gmail.com
