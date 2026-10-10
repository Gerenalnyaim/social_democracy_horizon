/**
 * Party Creator for Social Democracy: An Alternate Horizon
 * 
 * Allows creation of political parties with:
 * - Custom RGB colors for parliament seating visualization
 * - Left-right political positioning on the spectrum (-100 to 100)
 * - Properties for name, ideology, and seat count
 */

class PartyCreator {
  /**
   * Creates a new political party
   * @param {string} name - Party name
   * @param {Object} color - RGB color object {r: 0-255, g: 0-255, b: 0-255}
   * @param {number} position - Political position from -100 (far left) to 100 (far right)
   *                            -100: Communist/Far-Left
   *                            -50: Left/Socialist
   *                            0: Center
   *                            50: Right/Conservative
   *                            100: Far-Right
   * @param {number} seats - Number of parliament seats
   * @param {Object} options - Additional party properties
   */
  constructor(name, color, position, seats = 0, options = {}) {
    this.validateColor(color);
    this.validatePosition(position);
    
    this.name = name;
    this.color = this.normalizeColor(color);
    this.position = position;
    this.seats = seats;
    this.ideology = options.ideology || this.getIdeologyFromPosition(position);
    this.description = options.description || '';
    this.coalition = options.coalition || null;
    this.leader = options.leader || '';
  }

  /**
   * Validates that color object has valid RGB values
   */
  validateColor(color) {
    if (!color || typeof color !== 'object') {
      throw new Error('Color must be an object with r, g, b properties');
    }
    if (typeof color.r !== 'number' || typeof color.g !== 'number' || typeof color.b !== 'number') {
      throw new Error('Color r, g, b must be numbers');
    }
    if (color.r < 0 || color.r > 255 || color.g < 0 || color.g > 255 || color.b < 0 || color.b > 255) {
      throw new Error('Color values must be between 0 and 255');
    }
  }

  /**
   * Validates political position
   */
  validatePosition(position) {
    if (typeof position !== 'number' || position < -100 || position > 100) {
      throw new Error('Position must be a number between -100 (far left) and 100 (far right)');
    }
  }

  /**
   * Normalizes color to ensure all values are integers
   */
  normalizeColor(color) {
    return {
      r: Math.floor(color.r),
      g: Math.floor(color.g),
      b: Math.floor(color.b)
    };
  }

  /**
   * Gets ideology name based on political position
   */
  getIdeologyFromPosition(position) {
    if (position <= -75) return 'Far-Left Communist';
    if (position <= -50) return 'Left Socialist';
    if (position <= -25) return 'Centre-Left Progressive';
    if (position <= -5) return 'Centre-Left';
    if (position <= 5) return 'Centre';
    if (position <= 25) return 'Centre-Right';
    if (position <= 50) return 'Right Conservative';
    if (position <= 75) return 'Far-Right';
    return 'Ultra-Right';
  }

  /**
   * Returns RGB color as CSS string
   */
  getColorCSS() {
    return `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
  }

  /**
   * Returns RGB color as hex string
   */
  getColorHex() {
    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(this.color.r)}${toHex(this.color.g)}${toHex(this.color.b)}`;
  }

  /**
   * Gets position label
   */
  getPositionLabel() {
    if (this.position < 0) {
      return `Left (${this.position})`;
    } else if (this.position > 0) {
      return `Right (+${this.position})`;
    }
    return 'Centre (0)';
  }

  /**
   * Calculates seat positioning in parliament based on left-right spectrum
   * Useful for d3-parliament visualization
   * @param {number} totalSeats - Total seats in parliament
   * @returns {Object} Position information for parliament layout
   */
  getParliamentPosition(totalSeats = 500) {
    // Normalize position from (-100, 100) to (0, 1)
    const normalizedPosition = (this.position + 100) / 200;
    
    return {
      position: this.position,
      normalizedPosition: normalizedPosition,
      seats: this.seats,
      color: this.getColorCSS(),
      colorHex: this.getColorHex(),
      x: normalizedPosition * totalSeats, // X position for visualization
      seatPercentage: (this.seats / totalSeats) * 100
    };
  }

  /**
   * Returns party data as JSON object
   */
  toJSON() {
    return {
      name: this.name,
      color: this.color,
      position: this.position,
      seats: this.seats,
      ideology: this.ideology,
      description: this.description,
      coalition: this.coalition,
      leader: this.leader
    };
  }

  /**
   * Returns formatted party information
   */
  toString() {
    return `${this.name} (${this.ideology}) - ${this.getPositionLabel()} - ${this.seats} seats - Color: ${this.getColorHex()}`;
  }
}

/**
 * PartyFactory for creating parties with presets
 */
class PartyFactory {
  /**
   * Creates a party with preset colors and positions
   * @param {string} type - Preset party type
   * @param {Object} customOptions - Override default options
   */
  static createPreset(type, customOptions = {}) {
    const presets = {
      leftCommunist: {
        color: { r: 200, g: 10, b: 10 }, // Red
        position: -90,
        ideology: 'Far-Left Communist'
      },
      leftSocialist: {
        color: { r: 255, g: 0, b: 0 }, // Bright Red
        position: -60,
        ideology: 'Left Socialist'
      },
      centreLeft: {
        color: { r: 255, g: 140, b: 0 }, // Orange
        position: -25,
        ideology: 'Centre-Left Progressive'
      },
      centre: {
        color: { r: 100, g: 200, b: 100 }, // Green
        position: 0,
        ideology: 'Centre'
      },
      centreRight: {
        color: { r: 0, g: 100, b: 200 }, // Blue
        position: 25,
        ideology: 'Centre-Right'
      },
      rightConservative: {
        color: { r: 0, g: 50, b: 150 }, // Dark Blue
        position: 60,
        ideology: 'Right Conservative'
      },
      farRight: {
        color: { r: 50, g: 50, b: 50 }, // Dark Gray
        position: 85,
        ideology: 'Far-Right'
      }
    };

    if (!presets[type]) {
      throw new Error(`Unknown preset type: ${type}`);
    }

    const preset = presets[type];
    const name = customOptions.name || type;
    const color = customOptions.color || preset.color;
    const position = customOptions.position !== undefined ? customOptions.position : preset.position;
    const seats = customOptions.seats || 0;

    return new PartyCreator(name, color, position, seats, customOptions);
  }

  /**
   * Creates a party from hex color code
   */
  static createFromHex(name, hexColor, position, seats = 0, options = {}) {
    const hex = hexColor.replace('#', '');
    const color = {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
    return new PartyCreator(name, color, position, seats, options);
  }
}

// Export for use in modules/scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PartyCreator, PartyFactory };
}
