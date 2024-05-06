// Get all radio buttons
const radios = document.querySelectorAll('input[name="size"]');

// Loop through radio buttons and add event listener
radios.forEach(radio => {
  radio.addEventListener('change', function() {
    // Get the value of the selected radio button
    const size = this.value;
    
    // Remove existing size classes from images
    document.querySelectorAll('.game-icon').forEach(image => {
      image.classList.remove('small', 'medium', 'large');
      
      // Add the selected size class to images
      image.classList.add(size);
    });
  });
});
