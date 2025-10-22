function analyzeJson(data) {
    // Dummy analysis — replace with your actual rules
    const result = {
        recordCount: Array.isArray(data) ? data.length : 1,
        containsNulls: JSON.stringify(data).includes('null'),
        timestamp: new Date().toISOString()
    };

    return result;
}

module.exports = { analyzeJson };


  //TODO - Testvérszerszám
  //TODO - NA FCS LT kiemelve
  //TODO - Szerszámgép max fordulat ellenőrzés
  //TODO - NC és tagozódás számozás ellenőrzés
  //TODO - Helical drilling, ap ne legyen nagyobb mint az átmérő
  //TODO - Helical drilling, ne menjen többet, mint max 15 kör
  //TODO - 3D Optimized Roughing, vortex technológia / stragtéria ellenőrzés
  //TODO - 100P M20 menet fúrrás, nem marás
  //TODO - Lentkezdős Helical Drilling, Z+5 FMAX, Z-X F1000 ellenőrzés
