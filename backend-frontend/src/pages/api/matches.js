// pages/api/globoEsporte.js

export default async function handler(req, res) {
  try {
    // Object to store the results
    const responseData = {};

    // Array to store promises for each request
    const requests = [];

    // Loop through rounds from 1 to 6
    for (let i = 1; i <= 6; i++) {
      // Push each fetch promise into the requests array
      requests.push(
        fetch(`https://api.globoesporte.globo.com/tabela/83ad0ca5-f84e-4906-9242-a40d6585ebca/fase/fase-de-grupos-libertadores-2024/rodada/${i}/jogos`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch data from Globo Esporte API for rodada ${i}`);
            }
            return response.json();
          })
          .then(data => {
            // Transform and 
            const matches = [];
              try {
                for (const item of data) {
                  matches.push({
                    homeTeam: item.equipes.mandante.nome_popular,
                    homeTeamBadge: item.equipes.mandante.escudo,
                    homeTeamInitials: item.equipes.mandante.sigla,
                    awayTeam: item.equipes.visitante.nome_popular,
                    awayTeamBadge: item.equipes.visitante.escudo,
                    awayTeamInitials: item.equipes.visitante.sigla,
                    homeScore: item.placar_oficial_mandante,
                    awayScore: item.placar_oficial_visitante,
                    date: item.data_realizacao.substring(0, 10) || null,
                    started: item.jogo_ja_comecou
                  })
                }
              } catch(e) {
                console.log(`Something wrong with match between ${item.equipes.mandante.nome_popular} and ${item.visitante.mandante.nome_popular}`)
              }
            
            
            // store  with the corresponding key
            responseData[i] = matches;
          })
          .catch(error => {
            throw new Error(`Failed to fetch data from Globo Esporte API for rodada ${i}: ${error.message}`);
          })
      );
    }

    // Use Promise.all to wait for all requests to resolve
    await Promise.all(requests);

    // Send the object of data as the API response
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching data from Globo Esporte API:", error);
    res.status(500).json({ error: "Failed to fetch data from Globo Esporte API" });
  }
}
