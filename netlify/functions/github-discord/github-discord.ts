import { Handler, HandlerContext, HandlerEvent } from "@netlify/functions";
import { GithubService } from "./services/github.service";
import { DiscordService } from "./services/discord.service";

/* const notify = async (message: string) => {
  const body = {
    //* Mensaje que se enviará a Discord
    content: message,
    //* Embeds es un array de objetos que se pueden enviar a Discord, en este caso se envía un gif
    embeds: [
      {
        image: {
          url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW9rMTh0OWFveTJ5dHpyNW8zcmZ2aWFwdHV5aHd5OHU2eW53aXhzYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SvFocn0wNMx0iv2rYz/giphy.gif",
        },
      },
    ],
  };

  //* Consumiendo el webhook de Discord y enviando el mensaje para notificar
  const res = await fetch(process.env.DISCORD_WEBHOOK_URL ?? "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  //* Si no se pudo enviar el mensaje, se muestra un error en consola
  if (!res.ok) {
    console.log("Error sending message to Discord");
    return false;
  }
};

const onStart = (payload: any) => {
    //* 'action' es el tipo de acción que se realizó en el evento, 'sender' es el usuario que realizó la acción y 'repository' es el repositorio en el que se realizó la acción
    const { action,sender,repository } = payload;


    return `User ${sender.login} ${action} star on ${repository.full_name}`;
  }

const onIssue = (payload: any) => {
  let message: string = "";
  //* 'action' es el tipo de acción que se realizó en el evento, 'issue' es el issue que se creó o cerró 
  const { action, issue } = payload;
  
  if (action === "opened") {
    message = `An issue was opened with this title ${issue.title}`;
  }else if (action === "closed") {
    message = `An issue was closed with by ${issue.user.login}`;   
  } else {
    message = `Unhandled action for the issue event ${action}`;
  }

    
  return message;
} */

const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const githubService = new GithubService();
  const discordService = new DiscordService();

  const githubEvent = event.headers["x-github-event"] ?? "unknown";
  const payload = JSON.parse(event.body ?? "{}");

  
  const URL_IMAGES: { [key: string]: string } = {
    star: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnozYmV4c2pudWs0bzNxbmRqNTQ4eGJvZmVqOWxkcGZ4b2xwa29heSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GsxDnh135hJnHDl4e9/giphy.gif",
    issues: "https://user-images.githubusercontent.com/3369400/169278322-d903e32e-f752-4c0f-bf75-72e5a94d0f7b.gif",
    push: "https://raw.githubusercontent.com/JoeyBling/JoeyBling/master/pic/pusheencode.gif",
  };
  
  let message: string;

  switch (githubEvent) {
    case "star":
      message = githubService.onStart(payload);
      break;
    case "issues":
      message = githubService.onIssue(payload);
      break;
    case "push":
      message = githubService.onPush(payload);
      break;
    default:
      message = `**Evento desconocido:** _${githubEvent}_`;
  }

  await discordService.notify(message, URL_IMAGES[githubEvent]);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Message accepted!" }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export { handler };
