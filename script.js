document.addEventListener('DOMContentLoaded', () => {
  const currentLocation = window.location.pathname.split('/').pop(); // Get the current page name

  // Navigation highlighting (for all pages)
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop(); 
    if (linkPath === currentLocation) {
      link.style.backgroundColor = '#004d99'; // Highlight the active link
      link.style.color = '#fff';
      link.style.borderRadius = '10px'; 
    }
  });

  // Functionality for 'order.html' (price calculation, order confirmation)
  if (currentLocation === 'order.html') {
    const pricePerMealDeal = 19.99;
    let totalOrderPrice = 0;
    const pizzas = ["Hawaiian", "Meat Lovers", "Pepperoni", "Cheese"];
    const sides = ["Fries", "Garlic Bread", "Breadsticks", "Mashed Potatoes"];
    const drinks = ["Coca Cola", "Sprite", "Pepsi"];

    
    document.getElementById("confirm-order").addEventListener("click", function() {
      const quantity = parseInt(document.getElementById("quantity").value) || 0;
    
      if (quantity > 0) {
        
        openMealSelection(quantity);
      } else {
        alert("Please enter a valid quantity.");
      }
    });

    // Function to open the meal selection modal
    function openMealSelection(quantity) {
      const mealSelectionModal = document.getElementById('meal-selection-modal');
      const mealDealsContainer = document.getElementById('meal-deals-container');
      mealDealsContainer.innerHTML = ''; 
      totalOrderPrice = 0;  
    
      
      for (let i = 0; i < quantity; i++) {
        const mealDealDiv = document.createElement('div');
        mealDealDiv.classList.add('meal-deal');
        mealDealDiv.innerHTML = `
          <h3>Meal Deal ${i + 1}</h3>
          <label for="pizza-${i}">Select Pizza:</label>
          <select id="pizza-${i}" class="meal-option">
              ${pizzas.map(pizza => `<option value="${pizza}">${pizza}</option>`).join('')}
          </select>
          <label for="side-${i}">Select Side:</label>
          <select id="side-${i}" class="meal-option">
              ${sides.map(side => `<option value="${side}">${side}</option>`).join('')}
          </select>
          <label for="drink-${i}">Select Drink:</label>
          <select id="drink-${i}" class="meal-option">
              ${drinks.map(drink => `<option value="${drink}">${drink}</option>`).join('')}
          </select>
        `;
        mealDealsContainer.appendChild(mealDealDiv);
      }
    
      
      mealSelectionModal.classList.add('open');
    }

    // Handle the "Submit" button inside the modal
    document.getElementById('submit-meal-selection').addEventListener('click', function() {
      const selectedMeals = [];
      totalOrderPrice = 0;  

      // Validate that the name and phone are not empty
      const userName = document.getElementById('pickup-name').value.trim();
      const userPhone = document.getElementById('pickup-phone').value.trim();

      if (!userName || !userPhone) {
        alert("Please fill in your name and phone number.");
        return; 
      }

      const quantity = parseInt(document.getElementById("quantity").value) || 0;
      for (let i = 0; i < quantity; i++) {
        const pizza = document.getElementById(`pizza-${i}`).value;
        const side = document.getElementById(`side-${i}`).value;
        const drink = document.getElementById(`drink-${i}`).value;
        const mealTotal = pricePerMealDeal;  
        totalOrderPrice += mealTotal;  

        selectedMeals.push({
          pizza,
          side,
          drink,
          mealTotal: mealTotal.toFixed(2),
        });
      }

      // Display order summary and success message
      displayOrderSummary(selectedMeals, userName, userPhone);
    });

    // Close modal functionality
    document.getElementById('close-modal').addEventListener('click', function() {
      document.getElementById('meal-selection-modal').classList.remove('open');
    });

    // Function to update the total price dynamically
    function updateTotalPrice() {
      const quantity = parseInt(document.getElementById("quantity").value) || 0;
      const totalPrice = quantity * pricePerMealDeal;
      document.getElementById("total-price").textContent = totalPrice.toFixed(2); 
      document.getElementById("modal-total-price").textContent = totalPrice.toFixed(2); 
    }

    
    document.getElementById("quantity").addEventListener("input", updateTotalPrice);

    
    updateTotalPrice();

    // Function to display order success and summary on the page
    function displayOrderSummary(selectedMeals, userName, userPhone) {
      const successMessageContainer = document.getElementById('order-success-message');
      const orderSummaryContainer = document.getElementById('order-summary');

      // Clear any previous content
      successMessageContainer.style.display = 'block';  
      successMessageContainer.innerHTML = `
          <h3>Your pick-up order has been submitted!</h3>
          <p>We will call you to pick up your order when it is ready.</p>
          <p><strong>Name:</strong> ${userName}</p>
          <p><strong>Phone Number:</strong> ${userPhone}</p>
      `;

      
      orderSummaryContainer.innerHTML = '';
      
      // Display selected meals and total price
      let mealSummaryHTML = `<h3>Order Summary:</h3>`;
      selectedMeals.forEach(meal => {
        mealSummaryHTML += `
          <p>Meal: ${meal.pizza} with ${meal.side} and ${meal.drink} - $${meal.mealTotal}</p>
        `;
      });
      mealSummaryHTML += `<p><strong>Total: $${totalOrderPrice.toFixed(2)}</strong></p>`;

      orderSummaryContainer.innerHTML = mealSummaryHTML;
      orderSummaryContainer.style.display = 'block';  // Show order summary
    }
  }






  // Functionality for 'reserve.html' (table reservation)
  if (currentLocation === 'reserve.html') {
      const reservationForm = document.getElementById('reservation-form');
      const checkAvailabilityBtn = document.getElementById('check-availability');
      const tableListDiv = document.getElementById('table-list');
      const messageDiv = document.getElementById('message');

      const tables = [
        { id: 1, name: "Table 1" },
        { id: 2, name: "Table 2" },
        { id: 3, name: "Table 3" },
        { id: 4, name: "Table 4" },
        { id: 5, name: "Table 5" },
      ];

      let reservations = [
        { tableId: 1, startTime: "13:00", endTime: "15:00", userName: "John Doe" },
        { tableId: 3, startTime: "18:00", endTime: "20:00", userName: "Jane Smith" },
      ];

      const openingHour = 9;
      const closingHour = 21;

      checkAvailabilityBtn.addEventListener('click', () => {
        const userName = document.getElementById('user-name').value.trim();
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        if (!userName) {
          showMessage("Please enter your name.", "error");
          return;
        }

        if (!startTime || !endTime) {
          showMessage("Please select a valid time range.", "error");
          return;
        }

        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        if (startHour < openingHour || endHour > closingHour || startHour >= endHour) {
          showMessage("Please select a valid time range between 9:00 AM and 9:00 PM.", "error");
          return;
        }

        const availableTables = tables.filter(table =>
          !reservations.some(reservation =>
            reservation.tableId === table.id &&
            isTimeOverlapping(startTime, endTime, reservation.startTime, reservation.endTime)
          )
        );

        tableListDiv.innerHTML = "";
        if (availableTables.length > 0) {
          showMessage("There are tables available! Select a table to reserve:", "success");
          availableTables.forEach(table => {
            const tableButton = document.createElement('button');
            tableButton.textContent = table.name;
            tableButton.className = 'table-button';
            tableButton.addEventListener('click', () => reserveTable(table.id, startTime, endTime, userName));
            tableListDiv.appendChild(tableButton);
          });
        } else {
          showMessage("No tables available for the selected time range.", "error");
        }
      });

      function reserveTable(tableId, startTime, endTime, userName) {
        const formattedStartTime = formatTimeToAMPM(startTime);
        const formattedEndTime = formatTimeToAMPM(endTime);
        reservations.push({ tableId, startTime, endTime, userName });
        showMessage(`Thank you, ${userName}. Table ${tableId} has been reserved from ${formattedStartTime} to ${formattedEndTime}.`, "success");
        document.getElementById('user-name').value = "";
        document.getElementById('start-time').value = "";
        document.getElementById('end-time').value = "";
        tableListDiv.innerHTML = "";
      }

      function isTimeOverlapping(startA, endA, startB, endB) {
        return (startA < endB && endA > startB);
      }

      function formatTimeToAMPM(time) {
        const [hour, minute] = time.split(':').map(Number);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
      }

      function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type === "success" ? "success" : "error";
      }
    }


    // Functionality for 'reviews.html' (review display)
  if (currentLocation === 'reviews.html') {
    let reviews = [
      { 
        name: 'Alice', 
        rating: 5, 
        review: 'Amazing pizza! Loved the crust and toppings. The cheese was perfectly melted and the sauce was flavorful. Definitely coming back for more!', 
        timestamp: new Date('2024-11-27T13:00:00'), 
        image: 'pizzareview.jpg' 
      },
      { 
        name: 'Bob', 
        rating: 4, 
        review: 'Great food, but the service could be better. The pizza was delicious, but the wait time was a bit long. Still, a great experience overall!', 
        timestamp: new Date('2024-11-30T14:30:00'), 
        image: '' 
      }
    ];

    // Function to format the timestamp as "Month Day, Year - HH:MM AM/PM"
    function formatDateAndTime(date) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      
      return `${month} ${day}, ${year} - ${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    // Function to display reviews
    function displayReviews() {
      const reviewList = document.getElementById('review-list');
      reviewList.innerHTML = '';

      reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
        reviewDiv.innerHTML = `
          <p class="name">${review.name}</p>
          <p class="rating">${'⭐'.repeat(review.rating)}</p>
          <p class="time">${formatDateAndTime(review.timestamp)}</p>
          ${review.image ? `<img class="review-image" src="${review.image}" alt="Review image" />` : ''}
          <p class="review-text">${review.review}</p>
        `;
        reviewList.appendChild(reviewDiv);
      });
    }

    // Event listener for submitting a review
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const userName = document.getElementById('user-name').value;
      const rating = document.getElementById('rating').value;
      const reviewText = document.getElementById('review-text').value;
      const imageFile = document.getElementById('review-image').files[0];

      let imageUrl = '';
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
          imageUrl = event.target.result;
          addReview(userName, rating, reviewText, imageUrl);
        };
        reader.readAsDataURL(imageFile);
      } else {
        addReview(userName, rating, reviewText, '');
      }
    });

    // Function to add the review
    function addReview(userName, rating, reviewText, imageUrl) {
      const newReview = {
        name: userName,
        rating: parseInt(rating),
        review: reviewText,
        timestamp: new Date(),
        image: imageUrl
      };

      reviews.push(newReview);
      reviewForm.reset();
      displayReviews();
    }

    // Display initial reviews
    displayReviews();
  }
});



