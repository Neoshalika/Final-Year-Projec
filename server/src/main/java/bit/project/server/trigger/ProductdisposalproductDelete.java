package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class ProductdisposalproductDelete extends Trigger{

    @Override
    public String getName() {
        return "productdisposalproduct_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "productdisposalproduct";
    }

    public ProductdisposalproductDelete(){
        addBodyLine("    update product set qty = qty + OLD.qty where id = OLD.product_id;");
    }

}