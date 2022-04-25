package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class CustomerorderstatusData extends AbstractSeedClass {

    public CustomerorderstatusData(){
        addIdNameData(1, "Pending");
        addIdNameData(2, "In Production");
        addIdNameData(3, "Done");
        addIdNameData(4, "Handover");
    }

}