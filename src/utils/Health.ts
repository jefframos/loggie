
import BaseComponent from "loggie/core/gameObject/BaseComponent";
import { Signal } from "signals";

export default class Health extends BaseComponent {
    onDamage:Signal = new Signal();
    onHeal:Signal = new Signal();
    onKill:Signal = new Signal();

    private currentHealth:number = 1000;
    private maxHealth:number = 1000;

    reset(maxHealth:number = 100){
        this.onKill.removeAll();
        this.onHeal.removeAll();
        this.onDamage.removeAll();
        this.maxHealth = maxHealth;
        this.currentHealth = this.maxHealth;
    }
    setMaxHealth(value:number){
        this.maxHealth = value;
    }
    get isDead(){
        return this.currentHealth <= 0
    }
    get normal(){
        return this.currentHealth / this.maxHealth;
    }
    damage(amount:number) {
        this.currentHealth -= amount;

        // Dispatch the onDamage signal with the current health
        this.onDamage.dispatch(this.currentHealth);

        if (this.currentHealth <= 0) {
            this.kill();
        }
    }

    kill() {
        // Dispatch the onKill signal
        this.onKill.dispatch();
    }

    heal(amount:number) {
        this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth);

        // Dispatch the onDamage signal with the current health
        this.onHeal.dispatch(this.currentHealth);
    }

    getCurrentHealth() {
        return this.currentHealth;
    }
}