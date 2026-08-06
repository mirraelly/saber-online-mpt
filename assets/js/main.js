const form = document.querySelector('#contact-form');
const cepInput = document.querySelector('#cep');
const feedback = document.querySelector('#cep-feedback');
const logradouroInput = document.querySelector('#logradouro');
const bairroInput = document.querySelector('#bairro');
const cidadeInput = document.querySelector('#cidade');
const estadoInput = document.querySelector('#estado');
const resultMessage = document.querySelector('#form-result');
const modal = document.querySelector('#success-modal');
const modalClose = document.querySelector('#success-modal .modal-close');
const modalAction = document.querySelector('#success-modal .modal-action');

const cleanCep = (value) => value.replace(/\D/g, '');

const fillAddress = ({ logradouro, bairro, localidade, uf }) => {
    logradouroInput.value = logradouro || '';
    bairroInput.value = bairro || '';
    cidadeInput.value = localidade || '';
    estadoInput.value = uf || '';
};

const showCepError = (message) => {
    feedback.textContent = message;
    feedback.style.color = '#dc2626';
};

const showCepLoading = () => {
    feedback.textContent = 'Buscando endereço...';
    feedback.style.color = '#4f46e5';
};

const clearCepFeedback = () => {
    feedback.textContent = '';
};

const searchCep = async (value) => {
    const cep = cleanCep(value);
    if (cep.length !== 8) {
        clearCepFeedback();
        fillAddress({});
        return;
    }

    showCepLoading();

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            showCepError('CEP não encontrado.');
            fillAddress({});
            return;
        }

        fillAddress(data);
        feedback.textContent = 'Endereço encontrado com sucesso.';
        feedback.style.color = '#16a34a';
    } catch (error) {
        showCepError('Erro ao buscar o CEP. Tente novamente.');
        fillAddress({});
    }
};

cepInput.addEventListener('input', (event) => {
    const target = event.target;
    let value = target.value;
    value = cleanCep(value);
    if (value.length > 5) {
        value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
    }
    target.value = value;

    if (value.length === 9) {
        searchCep(value);
    } else {
        clearCepFeedback();
        fillAddress({});
    }
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = document.querySelector('#nome').value.trim();
    const email = document.querySelector('#email').value.trim();
    const mensagem = document.querySelector('#mensagem').value.trim();

    if (!nome || !email || !mensagem) {
        resultMessage.textContent = 'Preencha todos os campos obrigatórios.';
        resultMessage.style.color = '#dc2626';
        return;
    }

    resultMessage.textContent = 'Obrigado! Sua mensagem foi enviada com sucesso.';
    resultMessage.style.color = '#16a34a';
    openModal();
    form.reset();
    fillAddress({});
    clearCepFeedback();
});

const openModal = () => {
    modal?.classList.add('visible');
    modal?.setAttribute('aria-hidden', 'false');
};

const closeModal = () => {
    modal?.classList.remove('visible');
    modal?.setAttribute('aria-hidden', 'true');
};

modal?.addEventListener('click', (event) => {
    if (event.target === modal || event.target.dataset.modalClose !== undefined) {
        closeModal();
    }
});

modalClose?.addEventListener('click', closeModal);
modalAction?.addEventListener('click', closeModal);
