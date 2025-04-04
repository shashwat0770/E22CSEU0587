// Constants
const WINDOW_SIZE = 10;
const BASE_URL = 'http://20.244.56.144/evaluation-service';
const TIMEOUT = 500; // 500ms timeout

// Store numbers for each type
const numberStores = {
    p: [], // prime
    f: [], // fibonacci
    e: [], // even
    r: []  // random
};

// DOM Elements
const numberTypeSelect = document.getElementById('numberType');
const fetchBtn = document.getElementById('fetchBtn');
const prevStateElement = document.getElementById('prevState');
const currStateElement = document.getElementById('currState');
const latestNumbersElement = document.getElementById('latestNumbers');
const averageElement = document.getElementById('average');

// Helper function to calculate average
function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return (sum / numbers.length).toFixed(2);
}

// Helper function to display numbers
function displayNumbers(element, numbers) {
    element.innerHTML = numbers.map(num => 
        `<span class="number-item">${num}</span>`
    ).join('');
}

// Helper function to update window state
function updateWindowState(type, newNumbers) {
    const store = numberStores[type];
    const prevState = [...store];
    
    // Add new numbers to store, maintaining uniqueness
    newNumbers.forEach(num => {
        if (!store.includes(num)) {
            store.push(num);
            // Remove oldest number if window size is exceeded
            if (store.length > WINDOW_SIZE) {
                store.shift();
            }
        }
    });
    
    return prevState;
}

// Function to fetch numbers from API
async function fetchNumbers(type) {
    const endpoints = {
        p: '/primes',
        f: '/fibo',
        e: '/even',
        r: '/rand'
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

        const response = await fetch(`${BASE_URL}${endpoints[type]}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.numbers;
    } catch (error) {
        console.error('Error fetching numbers:', error);
        return null;
    }
}

// Main function to handle number fetching and display
async function handleFetch() {
    const type = numberTypeSelect.value;
    const button = fetchBtn;
    
    // Disable button during fetch
    button.disabled = true;
    button.textContent = 'Fetching...';
    
    try {
        const newNumbers = await fetchNumbers(type);
        
        if (newNumbers === null) {
            alert('Failed to fetch numbers. Please try again.');
            return;
        }
        
        // Update window state
        const prevState = updateWindowState(type, newNumbers);
        const currState = numberStores[type];
        
        // Update display
        displayNumbers(prevStateElement, prevState);
        displayNumbers(currStateElement, currState);
        displayNumbers(latestNumbersElement, newNumbers);
        
        // Update average
        const avg = calculateAverage(currState);
        averageElement.textContent = avg;
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        // Re-enable button
        button.disabled = false;
        button.textContent = 'Fetch Numbers';
    }
}

// Event Listeners
fetchBtn.addEventListener('click', handleFetch);

// Initial display
Object.keys(numberStores).forEach(type => {
    displayNumbers(prevStateElement, []);
    displayNumbers(currStateElement, []);
    displayNumbers(latestNumbersElement, []);
    averageElement.textContent = '0.00';
}); 