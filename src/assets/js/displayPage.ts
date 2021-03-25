//Wait for Dom ready
document.addEventListener("DOMContentLoaded", async (event) => {
    console.log("Phase 1: Dom loaded")
    Display.replacementLessonContainer = <HTMLDivElement>document.getElementById('rechts')
    Display.examContainer = <HTMLDivElement>document.getElementById('klausurenTableBody')
    Display.announcementContainer = <HTMLDivElement>document.getElementById('aushangTableBody')
    await Display.startUp();
});