/* 
* Generated by
* 
*      _____ _          __  __      _     _
*     / ____| |        / _|/ _|    | |   | |
*    | (___ | | ____ _| |_| |_ ___ | | __| | ___ _ __
*     \___ \| |/ / _` |  _|  _/ _ \| |/ _` |/ _ \ '__|
*     ____) |   < (_| | | | || (_) | | (_| |  __/ |
*    |_____/|_|\_\__,_|_| |_| \___/|_|\__,_|\___|_|
*
* The code generator that works in many programming languages
*
*			https://www.skaffolder.com
*
*
* You can generate the code from the command-line
*       https://npmjs.com/package/skaffolder-cli
*
*       npm install -g skaffodler-cli
*
*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
*
* To remove this comment please upgrade your plan here: 
*      https://app.skaffolder.com/#!/upgrade
*
* Or get up to 70% discount sharing your unique link:
*       https://app.skaffolder.com/#!/register?friend=5e007ebfa4f4b55911b44117
*
* You will get 10% discount for each one of your friends
* 
*/
import axios from "axios";
import UserApi from "../api/UserApi";

export default class SecurityService {
  /**
   * Set Authorization header
   */
  static setAuthorization() {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user")
      );

      if (user && user.token) {
        axios.defaults.headers.common["authorization"] = `Bearer ${user.token}`;
      } else {
        delete axios.defaults.headers.common["authorization"];
      }
    } catch (e) {
      console.error("User not valid");
      console.error(e);
    }
  }

  /**
   * Logout
   */
  static logout() {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    // Set header
    SecurityService.setAuthorization();
  }

  /**
   * Get logged user
   */
  static getUser() {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user")
      );
      return user;
    } catch (e) {
      console.error("User not valid");
      console.error(e);
    }
  }

  /**
   * Check role user
   */
  static hasRole(role) {
    const user = SecurityService.getUser();
    return user && user.roles && user.roles.indexOf(role) !== -1;
  }

  /**
   * Check if role array is auth
   */
  static isAuth(roles) {
    const user = SecurityService.getUser();
    if (!user) return false;

    if (!roles || roles.length === 0) return true;
    if (SecurityService.hasRole("ADMIN")) return true;

    for (let i in roles) {
      if (SecurityService.hasRole(roles[i])) return true;
    }
    return false;
  }

  /**
   * Verify JWT Token
   */
  static async verifyToken(roles) {
    let user = SecurityService.getUser();

    if (user) {
      SecurityService.setAuthorization();
      try {
        let res = await UserApi.verifyToken(user.token);
        if (res.username) {
          return true;
        } else {
          SecurityService.logout();
          return false;
        }
      } catch (err) {
        SecurityService.logout();
        return false;
      }
    } else return false;
  }

  /**
   * Get update user
   */
  static updateUser(user) {
    let userLocal = JSON.parse(localStorage.getItem("user"));

    if (userLocal) {
      userLocal.name = user.name;
      userLocal.surname = user.surname;
      userLocal.mail = user.mail;
      localStorage.setItem("user", JSON.stringify(userLocal));
    }

    let userSession = JSON.parse(sessionStorage.getItem("user"));
    if (userSession) {
      userSession.name = user.name;
      userSession.surname = user.surname;
      userSession.mail = user.mail;
      sessionStorage.setItem("user", JSON.stringify(userSession));
    }

    return user;
  }
}
