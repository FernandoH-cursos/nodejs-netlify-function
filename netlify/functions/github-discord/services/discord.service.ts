
export class DiscordService {
  private readonly discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL || "";

  constructor() {}
  

  async notify(message: string,urlImage: string) {
    const body = {
      //* Mensaje que se enviará a Discord
      content: message,
      //* Embeds es un array de objetos que se pueden enviar a Discord, en este caso se envía un gif
      embeds: [
        {
          image: {
            url: urlImage || "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW9rMTh0OWFveTJ5dHpyNW8zcmZ2aWFwdHV5aHd5OHU2eW53aXhzYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SvFocn0wNMx0iv2rYz/giphy.gif",
          },
        },
      ],
    };

    //* Consumiendo el webhook de Discord y enviando el mensaje para notificar
    const res = await fetch(this.discordWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    //* Si no se pudo enviar el mensaje, se muestra un error en consola
    if (!res.ok) {
      console.log("Error al enviar mensaje a Discord");
      return false;
    }

  }
}
