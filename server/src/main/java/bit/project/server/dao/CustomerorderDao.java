package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Customerorder;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface CustomerorderDao extends JpaRepository<Customerorder, Integer>{
    @Query("select new Customerorder (c.id,c.code,c.customer,c.doordered) from Customerorder c")
    Page<Customerorder> findAllBasic(PageRequest pageRequest);

    @Query("select new Customerorder (c.id,c.code,c.customer,c.doordered) from Customerorder c where c.customerorderstatus.id = 1 or c.customerorderstatus.id = 2")
    List<Customerorder> getAllForcustomOrderItem();

    @Query("select c from Customerorder c where c.balance <> 0 and c.customer.id =:id")
    List<Customerorder> getAllForPaymentByCustomer(@Param("id") Integer id);

    @Query("select c from Customerorder c where c.customer.id =:id")
    List<Customerorder> getAllForPaymentByCustomerfordetail(@Param("id") Integer id);


    Customerorder findByCode(String code);
}
