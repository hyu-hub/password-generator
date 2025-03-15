document.getElementById('generate').addEventListener('click', function() {
    const length = parseInt(document.getElementById('length').value, 10);
    const includeLetters = document.getElementById('includeLetters').checked;
    const includeDigits = document.getElementById('includeDigits').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const symbols = '@#$!%?&*()_+-=[]{}|;:,.<>';

    let characters = '';
    if (includeLetters) characters += letters;
    if (includeDigits) characters += digits;
    if (includeSymbols) characters += symbols;

    if (characters.length === 0) {
        alert('Please select at least one character type.');
        return;
    }

    let password = '';
    function getRandomInt(max) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % max;
    }

    for (let i = 0; i < length; i++) {
        password += characters.charAt(getRandomInt(characters.length));
    }

    document.getElementById('password').value = password;

    // Determine password strength based on crack time
    let combinations = Math.pow(characters.length, length);
    let crackTime = combinations / 1e6; // Assume 1 million guesses per second

    let strengthText;
    if (crackTime < 30) {
        strengthText = 'Super Weak';
    } else if (crackTime < 60) {
        strengthText = 'Very Weak';
    } else if (crackTime < 3600) {
        strengthText = 'Weak';
    } else if (crackTime < 86400) {
        strengthText = 'Moderately Weak';
    } else if (crackTime < 604800) {
        strengthText = 'Moderate';
    } else if (crackTime < 2592000) {
        strengthText = 'Moderately Strong';
    } else if (crackTime < 31536000) {
        strengthText = 'Strong';
    } else if (crackTime < 1e9) {
        strengthText = 'Very Strong';
    } else {
        strengthText = 'Super Strong';
    }

    // Convert crack time to a readable format with large number terms
    function formatCrackTime(crackTime) {
        const units = [
            { value: 31536000, singular: 'year', plural: 'years' },
            { value: 2592000, singular: 'month', plural: 'months' },
            { value: 604800, singular: 'week', plural: 'weeks' },
            { value: 86400, singular: 'day', plural: 'days' },
            { value: 3600, singular: 'hour', plural: 'hours' },
            { value: 60, singular: 'minute', plural: 'minutes' },
            { value: 1, singular: 'second', plural: 'seconds' }
        ];
    
        const largeNumbers = [
            { value: 1e12, name: 'trillion' },
            { value: 1e9, name: 'billion' },
            { value: 1e6, name: 'million' },
            { value: 1e3, name: 'thousand' }
        ];
    
        for (const large of largeNumbers) {
            if (crackTime >= large.value) {
                return `${(crackTime / large.value).toFixed(2)} ${large.name} ${units[0].plural}`;
            }
        }
    
        for (const unit of units) {
            if (crackTime >= unit.value) {
                const time = crackTime / unit.value;
                return `${time.toFixed(2)} ${time > 1 ? unit.plural : unit.singular}`;
            }
        }
    
        return 'less than a second';
    }

    // Display password strength and crack time
    const strengthElement = document.getElementById('strength');
    strengthElement.textContent = `${strengthText} - Estimated crack time: ${formatCrackTime(crackTime)}`;

    // Update the strength meter
    const strengthMeter = document.getElementById('strengthMeter');
    strengthMeter.value = crackTime > 1e9 ? 100 : crackTime / 1e7 * 100; // Scale for visualization
});

// Update the displayed length value when the slider is moved
document.getElementById('length').addEventListener('input', function() {
    document.getElementById('lengthValue').textContent = this.value;
});

document.getElementById('copy').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    passwordField.select();
    document.execCommand('copy');
    alert('Password copied to clipboard!');
});