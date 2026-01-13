document.addEventListener('DOMContentLoaded', () => {
    // 1. Interatividade Lateral: ScrollSpy para Nav e TOC
    const scrollTargets = document.querySelectorAll('.doc-section, h3[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const allTocLinks = document.querySelectorAll('.toc-link, .toc-sublink');

    const updateActiveLinks = () => {
        let current = '';
        let parentSection = '';
        const offset = 220; // Sensibilidade: um pouco abaixo do topo para melhor UX

        scrollTargets.forEach(target => {
            const rect = target.getBoundingClientRect();
            if (rect.top <= offset) {
                current = target.getAttribute('id');
                // Se o target for uma seção inteira (.doc-section), ele define o "pai" atual
                if (target.classList.contains('doc-section')) {
                    parentSection = current;
                }
            }
        });

        if (!current) return;

        // Se o current for um H3 mas ainda não identificamos o parentSection (ex: scroll muito rápido)
        // Tentamos extrair do ID proced-X-Y
        if (current.includes('-') && !parentSection) {
            const parts = current.split('-');
            if (parts[0] === 'proced' && parts.length >= 2) {
                parentSection = `proced-${parts[1]}`;
            } else if (parts[0] === 'rotina') {
                parentSection = 'rotina-atualizacao';
            }
        }

        // Atualizar Sidebar Esquerda (Nav) - Destaque o procedimento pai
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            link.classList.toggle('active', targetId === parentSection);
        });

        // Atualizar Sidebar Direita (TOC) - Destaque o item exato (seção ou sub-título)
        allTocLinks.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            link.classList.toggle('active', targetId === current);
        });
    };

    window.addEventListener('scroll', updateActiveLinks);
    updateActiveLinks(); // Executa ao carregar para definir estado inicial

    // 2. Smooth Scrolling para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 3. Gerenciamento de Tema (Modo Escuro)
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.dataset.theme = savedTheme;

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
    });

    // 4. Funcionalidade de Cópia para Code Blocks
    document.querySelectorAll('pre').forEach(block => {
        const button = document.createElement('button');
        button.innerText = 'Copy';
        button.className = 'copy-btn';
        button.style.cssText = 'position: absolute; right: 10px; top: 10px; font-size: 0.7rem; padding: 2px 5px; cursor: pointer; opacity: 0.6;';

        block.parentElement.style.position = 'relative';
        block.appendChild(button);

        button.addEventListener('click', () => {
            const code = block.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                button.innerText = 'Copied!';
                setTimeout(() => { button.innerText = 'Copy'; }, 2000);
            });
        });
    });
});
