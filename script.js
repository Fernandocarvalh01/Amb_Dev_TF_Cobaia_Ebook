document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Lógica do Menu Hambúrguer ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar o menu ao clicar em um link (útil para navegação em página única)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 2. Lógica da Animação de Código na Seção Hero ---
    const codeLines = document.querySelectorAll('.code-block .code-line');
    let lineIndex = 0;

    function animateCode() {
        if (codeLines.length === 0) return;

        codeLines.forEach(line => {
            line.style.width = '0%'; // Resetar largura para animação
            line.style.borderRight = '2px solid'; // Mostrar cursor
        });

        const typeLine = (index) => {
            if (index < codeLines.length) {
                const line = codeLines[index];
                const text = line.textContent.trim();
                line.style.width = '100%'; // Define a largura para 100% para mostrar todo o texto
                line.style.transition = `width ${text.length * 0.1}s steps(${text.length}) forwards`;

                line.addEventListener('transitionend', () => {
                    line.style.borderRight = 'none'; // Esconder cursor após digitar
                    setTimeout(() => {
                        typeLine(index + 1);
                    }, 500); // Pequeno atraso entre as linhas
                }, { once: true });
            } else {
                // Reiniciar a animação após um tempo
                setTimeout(() => {
                    animateCode();
                }, 3000); // Espera 3 segundos antes de reiniciar
            }
        };

        typeLine(0);
    }

    animateCode(); // Inicia a animação ao carregar a página

    // --- 3. Lógica das Demonstrações de Seção (HTML, CSS, JS) ---

    // Função para mostrar/esconder a área de demonstração
    function toggleDemo(demoId) {
        const demoArea = document.getElementById(demoId);
        if (demoArea) {
            // Se já estiver visível, esconde. Se estiver escondido, mostra.
            const isVisible = demoArea.style.display === 'flex';
            demoArea.style.display = isVisible ? 'none' : 'flex';
            demoArea.style.flexDirection = 'column';
            demoArea.style.gap = '20px';
            demoArea.style.justifyContent = 'center';
            demoArea.style.alignItems = 'center';
        }
    }

    // Exporta as funções para serem acessíveis no `onclick` do HTML
    window.showHTMLDemo = () => toggleDemo('htmlDemo');

    window.showCSSDemo = () => {
        toggleDemo('cssDemo');
        const cssBox = document.getElementById('cssBox');
        if (cssBox) {
            // Exemplo de manipulação do CSS dinamicamente
            const currentBg = cssBox.style.backgroundColor;
            const newBg = currentBg === 'rgb(0, 123, 255)' ? '#28a745' : '#007bff'; // Alterna entre cores
            cssBox.style.backgroundColor = newBg;

            // Exemplo de transição/transformação
            cssBox.style.transform = cssBox.style.transform === 'rotate(10deg) scale(1.1)' ? 'rotate(0deg) scale(1)' : 'rotate(10deg) scale(1.1)';
            cssBox.style.borderRadius = cssBox.style.borderRadius === '50%' ? '8px' : '50%'; // Alterna entre redondo e quadrado

            cssBox.innerHTML = `<p>Estilizado! Cor: ${newBg}</p>`;
        }
    };
    window.showJSDemo = () => toggleDemo('jsDemo');


    // --- 4. Lógica da Calculadora (Integrando com o server.js) ---
    window.calculate = async () => {
        const num1 = document.getElementById('num1').value;
        const num2 = document.getElementById('num2').value;
        const operation = document.getElementById('operation').value;
        const resultDiv = document.getElementById('result');

        resultDiv.textContent = 'Calculando...';
        resultDiv.style.color = '#6c757d'; // Cinza para "calculando"

        try {
            const response = await fetch('http://localhost:3001/api/calculadora', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    num1: parseFloat(num1), // Garante que são números
                    num2: parseFloat(num2),
                    operacao: operation
                }),
            });

            const data = await response.json();

            if (data.success) {
                resultDiv.textContent = `Resultado: ${data.data.resultado}`;
                resultDiv.style.color = '#007bff'; // Azul para sucesso
            } else {
                resultDiv.textContent = `Erro: ${data.message}`;
                resultDiv.style.color = '#dc3545'; // Vermelho para erro
            }
        } catch (error) {
            console.error('Erro ao conectar com a API:', error);
            resultDiv.textContent = 'Erro de conexão com o servidor.';
            resultDiv.style.color = '#dc3545';
        }
    };

    // --- Removido: Lógica do Formulário de Contato ---
    // const contactForm = document.getElementById('contactForm');
    // const formMessage = document.getElementById('formMessage');
    // if (contactForm && formMessage) { ... }

    // --- 5. Lógica do botão "Começar a Aprender" (scroll suave) ---
    const startLearningButton = document.getElementById('startLearning');
    if (startLearningButton) {
        startLearningButton.addEventListener('click', () => {
            document.getElementById('html').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- 6. Lógica para esconder as demos inicialmente (para o JS lidar com a visibilidade) ---
    document.getElementById('htmlDemo').style.display = 'none';
    document.getElementById('cssDemo').style.display = 'none';
    document.getElementById('jsDemo').style.display = 'none';
});