export default function CheckoutWizard({ activeStep }) {
    return (
        <div>
            <ul className={"progressbar"}>
                {[
                    "Login",
                    "Shipping Address",
                    "Payment Method",
                    "Place Order",
                ].map((step, i) => (
                    <li key={step} className={activeStep >= i ? "active" : ""}>
                        {step}
                    </li>
                ))}
            </ul>
        </div>
    );
}

{
    /* <ul className={styles["progressbar"]}>
    <li className={styles["active"]}>Indirizzo</li>
    <li className={`${activeStep > 0 ? styles["active"] : ""}`}>
        Metodo di pagamento
    </li>
</ul>; */
}
