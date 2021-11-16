export default function Checkout() {
    return (
        <main>
            <h1>Checkout</h1>

            <form>
                <div className={"filter-form-col-left"}>
                    <label>
                        <span>Name</span>
                    </label>
                </div>
                <div className={"filter-form-col-right"}>
                    <input type="text" name="name" id="name" />
                </div>

                <button type="submit">Enter</button>
            </form>
        </main>
    );
}
