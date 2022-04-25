package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ProductstatusData extends AbstractSeedClass {

    public ProductstatusData(){
        addIdNameData(1, "Pending");
        addIdNameData(2, "Ongoing");
        addIdNameData(3, "Done");
        addIdNameData(4, "Cancelled");
    }

}