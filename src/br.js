window.br = window.br || {
    itens: [],
    listas: [{
        nome: "Todos os Pokémons da primeira série",
        itens: Array(151).fill("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{0}.png").map((url, indice) => url.replace("{0}", indice + 1))
    }, {
        nome: "Copa do Mundo de 1994",
        itens: "DE,SA,AR,BE,BR,BO,BG,CM,CO,KR,ES,US,GR,IE,IT,MA,MX,NE,NO,NL,RO,RU,SE,CH".split(",").map(pais => `https://www.countryflags.io/${pais}/flat/64.png`)
    }, {
        nome: "Melhor Filme Oscar 2020",
        itens: "Ford vs Ferrari,O Irlandês,JoJo Rabbit,Coringa,Adoráveis Mulheres,História de um Casamento,1917,Era Uma Vez Em... Hollywood,Parasita".split(",")
    }],
    paleta: {
        "vermelho": "#c0392b",
        "azul": "#3498db"
    },
    componentes: {
        modal: (titulo, subtitulo, conteudo) => {
            const div = document.createElement("div");
            div.innerHTML = `<section style="position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;z-index:99999999999;justify-content:center;line-height:1.4;" data-sel="br-modal">
            <div style="position:absolute;width: 100%;height: 100%;background-color:rgba(0,0,0,.75);z-index: 1;cursor:pointer;" onclick="br.fecha()"></div>
            <div style="position:relative;background:#fff;box-shadow:0 0 10px rgba(0,0,0,.3);color:#444;z-index: 2;max-width:100%;">
                <span onclick="br.fecha()" style="position: absolute; right: 0; width: 40px; text-align: center; flex-direction: column; cursor: pointer; font-size: 20px; padding: 10px; color: #d8d8d8; text-shadow: 0px 0px 1px hsl(0, 0%, 91%);">&times;</span>
                <div style="padding: 10px;text-align: center;min-width: 400px;font-family: sans-serif;font-weight: 300;line-height: 1.2;"><p style="margin: 0;font-size: 20px;margin-top: 10px;color: #e74b3c;font-weight: 500;">${titulo}</p><p style="font-size: 12px;margin-top: 10px;color: #666;">${subtitulo}</p></div>
                <div style="padding: 10px;border-top: 1px solid #d8d8d8;">
                    ${conteudo.trim()}
                </div>
            </div>`;
            return div.firstChild;
        },
        botao: (configuracoes) => {
            configuracoes.cor = configuracoes.cor || "vermelho";
            return `<button onclick="${configuracoes.funcao}" style="box-shadow: none; background-color: ${br.paleta[configuracoes.cor]}; border-radius: 0; border: 0; padding: 10px 15px; color: #fff; outline: none; cursor: pointer; ${configuracoes.estilo || ''}">${configuracoes.texto}</button>`;
        },
        desafiante: (desafiante) => {
            const imagem = desafiante.match(new RegExp("^(https?|ftp)://.*(jpeg|png|gif|bmp|jpg)", "ig"));
            return imagem === null ? desafiante : `<img src="${desafiante}" style="max-width: 96px; vertical-align: middle;" />`;
        }
    }
};


br.pega = function pega(sel){
    return document.querySelector(`[data-sel="${sel}"]`) || null;
}

br.seleciona = function seleciona(indice){
    const perdedor = indice === 0
        ? br.itens.findIndex(item => item === br.itens[1])
        : br.itens.findIndex(item => item === br.itens[0])
    br.itens.splice(perdedor, 1);
    br.itens.length === 1 ? br.finaliza() : br.comeca(br.itens);
}

br.finaliza = function finaliza() {
    br.fecha();
    document.body.insertAdjacentElement("beforeend",br.componentes.modal("E o vencedor é:","O jogo chegou ao fim, temos um vencedor!",
        `<div style="display:flex;justify-content:center;">
            <p style="padding:20px;font-size:28px;">
                ${br.componentes.desafiante(br.itens[0])}
            </p>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 20px; margin-bottom: 20px; font-weight: 600; padding-top: 20px;">
            ${br.componentes.botao({cor: "azul", funcao: "br.abre()", texto: "Jogar denovo", estilo: "margin-right: 10px;"})}
            ${br.componentes.botao({cor: "vermelho", funcao: "br.fecha()", texto: "Fechar jogo"})}        
        </div>`));
}

br.fecha = function fecha(){
    const node = br.pega("br-modal");
    node && node.remove();
}

br.lista = function lista() {
    br.fecha();
    document.body.insertAdjacentElement("beforeend", br.componentes.modal("Batle Royale!", "Selecione uma lista salva", `
        <div style="margin-top: 20px;">
            <ul style="margin:10px;">
                ${br.listas.map((lista, indice) => `
                    <li onclick="br.comeca(br.listas[${indice}].itens)" style="cursor:pointer;font-weight:500;font-size: 14px;list-style: none;margin: 0 0 10px;">${lista.nome} - <span style="color: #ccc;">${lista.itens.length} itens</span></li>
                `).join("")}
            </ul>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 20px; font-weight: 600; padding-top: 20px;">
            ${br.componentes.botao({cor: "vermelho", funcao: "br.abre()", texto: "Voltar"})}
        </div>`));
}

br.salvar = function(itens) {
    const nome = `${itens.sort(() => 0.5 - Math.random()).slice(0, 1)} e outros`
    br.listas.push({
        nome:
        itens
    });
}

br.comeca = function comeca(itens = []){
    br.itens = itens.length > 1 ? [...itens] : br.pega("br-textarea").value.split("\n").filter(linha => linha).map(linha => linha.trim().replace(/<[^>]*>?/gm, "")).filter((item, indice, linhas) => linhas.indexOf(item) == indice);
    if(br.itens.length < 2) return;

    br.fecha();
    br.desafiantes = br.itens.sort(() => 0.5 - Math.random()).slice(0, 2);
    document.body.insertAdjacentElement("beforeend",br.componentes.modal(br.itens.length > 2 ? "Batalha!" : "Bataaaaalha final!" ,`Escolha somente um. ${br.itens.length > 2 ? `Faltam <strong>${br.itens.length -1}</strong> batalhas`: ""}`, `
        <div> 
            <div style="display: flex; font-size: 30px; padding: 0; text-align: center; width: 100%; flex-direction: column; ">
                <p onclick="br.seleciona(0)" style="margin: 0; padding: 10px; cursor:pointer; ">
                    <span style="color: #3398db; margin-right: 10px; ">A</span>
                    ${br.componentes.desafiante(br.desafiantes[0])}
                </p>
                <span style="font-size: 13px; color: #ccc; height: 1px; border-top: 1px solid #efefef; margin: 10px; line-height: 1px; width: 50%; text-shadow: 0px 0px 5px #fff; margin: 20px; align-self: center; ">VS</span>
                <p onclick="br.seleciona(1)" style="padding: 10px; cursor:pointer; margin: 0; ">
                    <span style="margin-right: 10px; color: #c0382b; ">B</span>
                    ${br.componentes.desafiante(br.desafiantes[1])}
                </p>
            </div>
            <div style="display: flex; justify-content: center; margin-top: 20px; margin-bottom: 20px; font-weight: 600; padding-top: 20px; ">
                ${br.componentes.botao({cor: "azul", funcao: "br.seleciona(0)", texto: "A", estilo: "margin-right: 10px;"})}
                ${br.componentes.botao({cor: "vermelho", funcao: "br.seleciona(1)", texto: "B"})}
            </div>
        </div>`)); }

br.abre = function abre(){
    br.fecha();
    document.body.insertAdjacentElement("beforeend",br.componentes.modal("Battle Royale!",`Digite sua lista. 1 item por linha <span style="color: ${br.paleta.azul};cursor:pointer;" onclick="br.lista()">ou use uma lista salva.</span>`, `
        <textarea data-sel="br-textarea" style="border: 1px solid rgb(216, 216, 216); resize: vertical; margin: 0px; width: 100%; height: 140px;">
Dona Deola
Calle 54
Serafim
Alecrim
Nutrikilo
C3
Vila Roma
Cidade SP
Sesc Paulista
Divina Panela
Savana
Xodó    
</textarea>
        <div style="display: flex; align-items: center; padding-top: 10px; ">
            <span style="display:flex;">
                <input type="checkbox" id="lista-em-texto" data-sel="lista-em-texto">
                <label for="lista-em-texto">Salvar lista</label>
            </span>
            ${br.componentes.botao({cor: "vermelho", funcao: `br.comeca()`, texto: "Começar!", estilo: "margin-left: auto;"})}
        </div>`))
}

br.abre();
