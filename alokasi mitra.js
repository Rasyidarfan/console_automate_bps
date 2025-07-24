const emails =['nikodemusmandowen1622@gmail.com','juliakoibur@gmail.com','rudytehupuring@gmail.com','alinawenda69@gmail.com','eleminamatuan7721@gmail.com','hadjierrahman@gmail.com','jovantamelab@transformnation.is','mekiwanimbo9734@gmail.com','bandargombo9723@gmail.com','slametnf17@gmail.com'];

function simulateTyping(element, text) {
    // Clear existing value
    element.value = '';
    
    // Focus element
    element.focus();
    element.dispatchEvent(new Event('focus', { bubbles: true }));
    
    // Simulate typing character by character
    for (let i = 0; i < text.length; i++) {
        element.value = text.substring(0, i + 1);
        
        // Dispatch input events
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('keyup', { bubbles: true }));
    }
    
    // Final events
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
}

async function processEmail(email, index) {
    console.log(`Processing email ${index + 1}/${emails.length}: ${email}`);
    
    const inputElement = document.querySelector('#tabs-home-ex1 input.form-control');
    
    if (inputElement) {
        simulateTyping(inputElement, email);
        
        // Wait for any filters to process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Click the button
        const clickElement = $('#tabs-home-ex1 .cursor-pointer:nth(2)');
        if (clickElement) {
            clickElement.click();
        }
    }
}

async function processAllEmails() {
    for (let i = 0; i < emails.length; i++) {
        await processEmail(emails[i], i);
        
        if (i < emails.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    console.log('Semua email telah diproses!');
}

processAllEmails();