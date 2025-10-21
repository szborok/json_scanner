function checkM110(operations) {
  const errors = [];
  const listOfM110RequirePrograms = new Set();

  operations.forEach((op) => {
    if (isM110Required4HelicalDrilling(op)) {
      listOfM110RequirePrograms.add(op.programName);
    }
  });

  return errors;
}
