import formatAdapter from "../config/format.adapter";
import {
  GithubIssuePayload,
  GithubPushPayload,
  GithubStarPayload,
} from "../interfaces";

export class GithubService {
  constructor() {}

  onStart(payload: GithubStarPayload) {
    let message: string = "";

    //* 'action' es el tipo de acción que se realizó en el evento, 'sender' es el usuario que realizó la acción y 'repository' es el repositorio en el que se realizó la acción
    const { action, sender, repository } = payload;

    if (action === "created") {
      message = "dio";
    }

    if (action === "deleted") {
      message = "quitó";
    }

    return `El usuario **${sender.login}** ${message} una estrella al repositorio **${repository.full_name}**`;
  }

  onIssue(payload: GithubIssuePayload) {
    let message: string = "";
    //* 'action' es el tipo de acción que se realizó en el evento, 'issue' es el issue que se creó o cerró
    const { action, issue } = payload;

    if (action === "opened") {
      message = `${issue.user.login} abrió un issue llamado **_${issue.title}_**`;
    } else if (action === "closed") {
      message = `${issue.user.login} cerró el issue llamado **_${issue.title}_**`;
    } else if (action === "deleted") {
      message = `${issue.user.login} eliminó el issue llamado **_${issue.title}_**`;
    } else {
      message = `**La siguiente accion de un issue no está manejada:** _${action}_`;
    }

    return message;
  }

  onPush(payload: GithubPushPayload) {
    const { ref, repository, head_commit } = payload;
    const { arrayToString } = formatAdapter;

    let message = `
    
      ## Se hizo el siguiente _push_ en el repositorio **${
        repository.full_name
      }**:
      - **Rama:** ${ref}
      - **Nombre de Commit:** ${head_commit.message}
      - **Autor de commit:** ${head_commit.author.name}
      - **URL de commit:** ${head_commit.url}
      - **Archivos alterados del commit:**
        - **Agregados:** ${head_commit.added.length} 
          - **Archivos agregados:** ${
            arrayToString(
              head_commit.added.map((file) =>
                `\t\t\t- ${file}`.replace(",", "")
              )
            ) || "No hay archivos agregados"
          }
        - **Eliminados:** ${head_commit.removed.length} 
          - **Archivos eliminados:** ${
            arrayToString(
              head_commit.removed.map((file) =>
                `\t\t\t- ${file}`.replace(",", "")
              )
            ) || "No hay archivos eliminados"
          }
        - **Modificados:** ${head_commit.modified.length}
          - **Archivos modificados:** ${
            arrayToString(
              head_commit.modified.map((file) =>
                `\t\t\t- ${file}`.replace(",", "")
              )
            ) || "No hay archivos modificados"
          }
    `;

    return message;
  }
}
