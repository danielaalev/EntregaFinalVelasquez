const services = [
    {
        name: 'Venue Service',
        id: 'venue',
        options: [
            { name: 'Option 1: Secret luxury location outside the city', price: 7500 },
            { name: 'Option 2: 5-star hotel within the city', price: 4500 }
        ]
    },
    {
        name: 'Catering Service',
        id: 'catering',
        options: [
            { name: 'Option 1: Premium selection', price: 2000 },
            { name: 'Option 2: Standard selection', price: 1500 }
        ]
    },
    {
        name: 'Decoration Service',
        id: 'decoration',
        options: [
            { name: 'Option 1: Exclusive High-End Decor', price: 10000 },
            { name: 'Option 2: Traditional Decor', price: 8000 }
        ]
    },
    {
        name: 'Photography & Videography',
        id: 'photovideo',
        options: [
            { name: 'Option 1: Artistic Masterpieces', price: 5000 },
            { name: 'Option 2: Classic captures', price: 4000 }
        ]
    },
    {
        name: 'Wedding Attire',
        id: 'wedattire',
        options: [
            { name: 'Option 1: Couture Elegance', price: 10000 },
            { name: 'Option 2: Sophisticated Charm', price: 7000 }
        ]
    },
    {
        name: 'Entertainment Service',
        id: 'entertainment',
        options: [
            { name: 'Option 1: Luxury Entertainment Showcase', price: 15000 },
            { name: 'Option 2: Classic Performances', price: 10000 }
        ]
    },
    {
        name: 'Invitations & Stationery Service',
        id: 'invitations',
        options: [
            { name: 'Option 1: Opulent Designs', price: 3000 },
            { name: 'Option 2: Traditional Invitations and Stationery', price: 2000 }
        ]
    },
    {
        name: 'Accommodation Service',
        id: 'accommodation',
        options: [
            { name: 'Option 1: 5-star hotel', price: 15000 },
            { name: 'Option 2: 4-star hotel', price: 11000 }
        ]
    },
    {
        name: 'Wedding Cake Service',
        id: 'cake',
        options: [
            { name: 'Option 1: Sylvia Weinstock Cakes', price: 5000 },
            { name: 'Option 2: Local baker cake', price: 2000 }
        ]
    },
    {
        name: 'Hair & Makeup Service',
        id: 'hairmakeup',
        options: [
            { name: 'Option 1: Makeup by Patrick Ta and Hair by Guido Palau', price: 7500 },
            { name: 'Option 2: Makeup and Hair by local make-up artist and hairstylist', price: 2000 }
        ]
    },
];

const shoppingCart = [];
let containerServs = document.getElementById('wedservices');
let bodyTable = document.getElementById('bodytable');

//Render services

function renderServices(servicelist) {
    servicelist.forEach((service) => {
        const serviceCard = document.createElement('div');
        serviceCard.setAttribute('class', 'card');
        serviceCard.innerHTML = `    
        <h5 class="card-header">${service.name}</h5>
        <div class="card-body">
            <h5>Option 1: ${service.options[0].name}</h5>
            <p>Price: $${service.options[0].price}</p>
            <h5>Option 2: ${service.options[1].name}</h5>
            <p>Price: $${service.options[1].price}</p>
            <button class="btn btn-secondary buy ${service.id}" data-id="${service.id}" data-option-index="0">Select Option 1</button>
            <button class="btn btn-secondary buy ${service.id}" data-id="${service.id}" data-option-index="1">Select Option 2</button>
        </div>
    `;

        containerServs.appendChild(serviceCard);
        const buyButton = document.querySelectorAll(`.${service.id}`);
        buyButton.forEach(btn=>{
            btn.addEventListener('click', addService);
        });
    });
}

function addService(e){
    const id = e.target.dataset.id;
    const indexBtn = parseInt(e.target.dataset.optionIndex);
    const chosenService = services.find(service => service.id === id);    
    const option = chosenService.options[indexBtn];

    addToShoppingCart(chosenService.name, option.name, option.price);
    Swal.fire({
        title: `You added ${chosenService.name} - ${option.name} to the shopping cart`,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }); 
}

renderServices(services);

const addedServices = [];

// Function to add a service option to the shopping cart

function addToShoppingCart(serviceName, optionName, price) {
    const tableBody = document.getElementById('bodytable');

    // Create a new row for the option
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${serviceName}</td>
    <td>${optionName}</td>
    <td>${price}</td>
    <td><button class="remove">Remove</button></td>
  `;

    tableBody.appendChild(row);

    const serviceToAdd = {
        name: serviceName,
        option: optionName,
        price: price,
    };

    addedServices.push(serviceToAdd);

    const totalCost = addedServices.reduce((total, serviceToAdd) => total + serviceToAdd.price, 0);

    updateTotalCost(totalCost);

    calculateWedPlanner();
    calculateTotalWed();

    // Event listener to the remove button
    const removeButton = row.querySelector('.remove');
    removeButton.addEventListener('click', function () {
        removeService(serviceToAdd);
        row.remove();
    });
}

// Function to remove a service from the shopping cart

function removeService(service) {
    const index = addedServices.indexOf(service);
    if (index !== -1) {
        addedServices.splice(index, 1);
    }

    const totalCost = addedServices.reduce((total, serviceToAdd) => total + serviceToAdd.price, 0);
    updateTotalCost(totalCost);

    calculateWedPlanner();
    calculateTotalWed();
}

// Function to update the total cost of the services
function updateTotalCost(totalCost) {
    const totalRow = document.getElementById('totalRow');
    totalRow.innerHTML = `
      <td colspan="2">Subtotal:</td>
      <td>${totalCost}</td>
    `;

    //Storage
    localStorage.setItem('addedServices', JSON.stringify(addedServices));
}

// Function to extract the option prices from addedServices array

function extractOptionPrices() {
    return addedServices.map(service => service.price);
}

//Function to add the wedding planner cost

function calculateWedPlanner() {
    const totalCost = addedServices.reduce((total, serviceToAdd) => total + serviceToAdd.price, 0);
    const weddingPlanner = totalCost * 0.1;

    const weddingPlannerElement = document.querySelector('.weddingplanner');
    weddingPlannerElement.textContent = `Wedding Planner services: $${weddingPlanner}`;
}

//Function to calculate the total cost of the wedding

function calculateTotalWed() {
    const totalCost = addedServices.reduce((total, serviceToAdd) => total + serviceToAdd.price, 0);
    const weddingPlanner = totalCost * 0.1;
    const totalWedding = totalCost + weddingPlanner;

    const totalCostElement = document.querySelector('.totalwedding');
    totalCostElement.textContent = `Total: $${totalWedding}`;
}

calculateTotalWed();

// Function to clear the shopping cart and totals

function clearShoppingCart() {
    const tableBody = document.getElementById('bodytable');
    const totalRow = document.getElementById('totalRow');
    const weddingPlannerElement = document.querySelector('.weddingplanner');
    const totalCostElement = document.querySelector('.totalwedding');

    tableBody.innerHTML = '';
    totalRow.innerHTML = '<td colspan="2">Total:</td><td></td>';
    weddingPlannerElement.textContent = 'Wedding Planner services: $0';
    totalCostElement.textContent = 'Total: $0';
    addedServices.length = 0;

    // Clear the storage
    localStorage.removeItem('addedServices');
}

// Event listener for the Checkout button

const checkoutButton = document.querySelector('.finish');
checkoutButton.addEventListener('click', function () {
    Swal.fire({
        title: 'Sweet!',
        text: 'You will receive an email from us shortly.',
        imageUrl: 'img/checkoutimg.JPG',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Wedding Rings Image',
    });

    clearShoppingCart();
});


// Function to empty the shopping cart 

function emptyShoppingCart() {
    const tableBody = document.getElementById('bodytable');
    const totalRow = document.getElementById('totalRow');
    const weddingPlannerElement = document.querySelector('.weddingplanner');
    const totalCostElement = document.querySelector('.totalwedding');

    tableBody.innerHTML = '';
    totalRow.innerHTML = '<td colspan="2">Total:</td><td></td>';
    weddingPlannerElement.textContent = 'Wedding Planner services: $0';
    totalCostElement.textContent = 'Total: $0';
    addedServices.length = 0;

    // Clear the storage
    localStorage.removeItem('addedServices');
}

// Event listener for the Empty button

const emptyButton = document.querySelector('.empty');
emptyButton.addEventListener('click', function () {
    emptyShoppingCart();
});

// DOLLAR API

function getDollar() {
    const URLDOLLAR = 'https://api.bluelytics.com.ar/v2/latest';
    fetch(URLDOLLAR)
        .then((response) => response.json())
        .then(data => {
            console.log(data)
            const dollarPrice = data.blue;
            document.getElementById('dollarPriceToday').innerText = `Dollar Price Today: $${dollarPrice.value_sell}ARS`;
        })
}

getDollar(); 
