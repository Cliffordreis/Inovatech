
//conf particles.js
document.addEventListener("DOMContentLoaded", function() {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 100,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 5,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 2
            },
            "move": {
                "enable": true,
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false
                },
                "onclick": {
                    "enable": false
                },
                "resize": true
            }
        },
        "retina_detect": true
    });
});

// Função para carregar os estados brasileiros usando a API do IBGE
async function carregarEstados() {
    const estadoSelect = document.getElementById("estado");
    const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
    const estados = await response.json();

    estados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.id; // Usa o ID do estado para buscar cidades
        option.textContent = estado.nome;
        estadoSelect.appendChild(option);
    });
}

// Função para carregar as cidades do estado selecionado
// Função para carregar os estados
async function carregarEstados() {
    const estadoSelect = document.getElementById("estado");
    const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
    const estados = await response.json();

    // Popula o select de estados com os dados retornados
    estados.forEach(estado => {
        const option = document.createElement("option");
        option.value = estado.id;  // Usando o ID do estado
        option.textContent = estado.nome;
        estadoSelect.appendChild(option);
    });
}

// Função para carregar as cidades com base no estado selecionado
async function carregarCidades() {
    const estadoSelect = document.getElementById("estado");
    const cidadeSelect = document.getElementById("cidade");
    const estadoId = estadoSelect.value;
    const fretev = document.getElementById("frete");

    // Limpa as opções de cidade e desabilita o campo antes de carregar novas cidades
    cidadeSelect.innerHTML = '<option selected>Escolha uma cidade</option>';
    cidadeSelect.disabled = true;
    fretev.hidden = true;

    if (estadoId) {
        // Carrega as cidades do estado selecionado
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`);
        if (!response.ok) {
            console.error("Erro ao carregar cidades");
            return;
        }

        const cidades = await response.json();

        // Adiciona as cidades ao select
        cidades.forEach(cidade => {
            const option = document.createElement("option");
            option.value = cidade.nome;
            option.textContent = cidade.nome;
            cidadeSelect.appendChild(option);
        });

        // Habilita o campo de cidade após carregar as opções
        cidadeSelect.disabled = false;
        fretev.hidden = false;
    }
}

// Carrega os estados ao carregar a página
carregarEstados();

