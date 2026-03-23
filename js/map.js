function toggleAll() {
    const markersVisible = !areMarkersVisible(); // Check current marker visibility
    const newButtonText = markersVisible ? 'Show All' : 'Hide All';

    // Toggle markers visibility
    setLayerVisibility(markersLayer, markersVisible);

    // Update the button text
    toggleButtonText(newButtonText);
}

function areMarkersVisible() {
    // Return the current visibility state of markers
    return markersLayer.getVisible();
}

function toggleButtonText(text) {
    const button = document.getElementById('toggleButton'); // Assuming there's a button with this ID
    button.innerText = text;
}