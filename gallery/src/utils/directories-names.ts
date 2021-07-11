const names = {
    slub: "ślub",
    slubu: "ślubu",
    slubowi: "ślubowi",
    slubem: "ślubem",
    slubie: "ślubie",
    gosc: "gość",
    goscia: "gościa",
    gosciu: "gościu",
    goscie: "goście",
    gosci: "gości",
    blogoslawienstwo: "błogosławieństwo",
    blogoslawienstwem: "błogosławieństwem",
    przebierancy: "przebierańcy",
    kosciol: "kościół",
    kosciola: "kościoła",
    kosciele: "kościele",
    zyczenia: "życzenia",
    przyjecie: "przyjęcie",
    przyjeciu: "przyjęciu",
    przyjecia: "przyjęcia",
}

export const getDirectoryName = (directoryName: string) => {
    
    const wordsInDirectoryName = directoryName.split(" ");
    const fixedWords = wordsInDirectoryName.map(w => names[w] ?? w);

    return fixedWords.join(" ");
}